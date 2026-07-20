import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, Text, View } from "react-native";

import { AirlineCard } from "@/components/flight-detail/airline-card";
import { AirportTimesBlock } from "@/components/flight-detail/airport-times-block";
import { DetailHeader } from "@/components/flight-detail/detail-header";
import { EditFieldCard } from "@/components/flight-detail/edit-field-card";
import { ForecastCard } from "@/components/flight-detail/forecast-card";
import { GoodToKnowSection } from "@/components/flight-detail/good-to-know-section";
import { InboundTimelineCard } from "@/components/flight-detail/inbound-timeline-card";
import { NotesCard } from "@/components/flight-detail/notes-card";
import { PlaneCard } from "@/components/flight-detail/plane-card";
import { RouteHistoryCard } from "@/components/flight-detail/route-history-card";
import { RouteMetaRow } from "@/components/flight-detail/route-meta-row";
import { StatusBanner } from "@/components/flight-detail/status-banner";
import { TimetableCard } from "@/components/flight-detail/timetable-card";
import { UpdatesCard } from "@/components/flight-detail/updates-card";
import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { getAirline } from "@/data/airlines";
import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import { getUpdatesFor } from "@/data/flight-updates";
import { useNow } from "@/hooks/use-now";
import { tapHaptic } from "@/utils/haptics";
import { useFlightsStore } from "@/stores/flights-store";
import { useUiStore } from "@/stores/ui-store";
import {
  formatDurationShort,
  formatLocalTime,
  getFlightPhase,
  getFlightTimes,
} from "@/utils/flight-time";

export default function FlightDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const key = decodeURIComponent(id ?? "");
  const flight = useFlightsStore((s) => s.flights.find((f) => f.key === key));
  const updateFlight = useFlightsStore((s) => s.updateFlight);
  const removeFlight = useFlightsStore((s) => s.removeFlight);
  const now = useNow();

  // Workaround for expo/expo#44493: a bottom Stack.Toolbar configured while a
  // formSheet is mid-presentation renders blank UIBarButtonItems (no icons or
  // labels), and re-presented sheets always hit that window. Mounting the
  // toolbar only after the sheet's presentation transition has settled renders
  // reliably. Timer is a fallback in case transitionEnd doesn't fire.
  const navigation = useNavigation();
  const [toolbarReady, setToolbarReady] = useState(false);
  useEffect(() => {
    const unsubscribe = (navigation as any).addListener("transitionEnd", () =>
      setToolbarReady(true)
    );
    const timer = setTimeout(() => setToolbarReady(true), 900);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [navigation]);

  // Drive the globe's detail mode (chips, plane marker, camera focus).
  useEffect(() => {
    useUiStore.getState().setSelectedFlightKey(key);
    return () => useUiStore.getState().setSelectedFlightKey(null);
  }, [key]);

  const template = flight ? getTemplate(flight.templateId) : undefined;
  const updates = useMemo(
    () => (template && flight ? getUpdatesFor(template, flight.dateISO) : []),
    [template, flight]
  );

  if (!flight || !template) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.secondaryLabel }}>Flight not found</Text>
      </View>
    );
  }

  const times = getFlightTimes(template, flight.dateISO);
  const phase = getFlightPhase(times, now);
  const origin = getAirport(template.from);
  const dest = getAirport(template.to);
  const airline = getAirline(template.airlineIata);
  const operating = template.operatedAs;

  const banner =
    phase === "scheduled"
      ? {
          prefix: "Gate Departure in ",
          emphasis: formatDurationShort(times.gateDep - now),
          body: `Inbound aircraft is in air from ${dest.city}, with enough time for ${formatLocalTime(
            times.gateDep,
            origin.tzOffsetMinutes
          )} departure`,
        }
      : phase === "inAir"
        ? {
            prefix: "Landing in ",
            emphasis: formatDurationShort(times.land - now),
            body: `Flying at 34,000 ft • ${Math.round(
              template.distanceMi * (1 - (now - times.takeOff) / (times.land - times.takeOff))
            ).toLocaleString()} mi to go`,
          }
        : {
            prefix: "Arrived ",
            emphasis: formatLocalTime(times.gateArr, dest.tzOffsetMinutes),
            body: `Landed ${formatLocalTime(times.land, dest.tzOffsetMinutes)} • Gate arrival ${formatLocalTime(
              times.gateArr,
              dest.tzOffsetMinutes
            )}`,
          };

  const depStatusLine =
    phase === "scheduled"
      ? `Departs in ${formatDurationShort(times.gateDep - now)}`
      : `Departed ${formatLocalTime(times.gateDep, origin.tzOffsetMinutes)}`;
  const arrStatusLine =
    phase === "landed" || phase === "arrived"
      ? `Arrived ${formatLocalTime(times.gateArr, dest.tzOffsetMinutes)}`
      : `Arrives in ${formatDurationShort(times.gateArr - now)}`;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Native close button in the sheet's top-right corner. */}
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="xmark"
          tintColor={colors.secondaryLabel}
          accessibilityLabel="Close"
          onPress={() => router.back()}
        />
      </Stack.Toolbar>
      {/* Native bottom toolbar: share / mute / more on the left, Add Return on the right. */}
      {toolbarReady ? (
      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          tintColor={colors.label}
          accessibilityLabel="Share flight"
          onPress={tapHaptic}
        />
        <Stack.Toolbar.Button
          icon="bell.slash"
          tintColor={colors.label}
          accessibilityLabel="Mute notifications"
          onPress={tapHaptic}
        />
        <Stack.Toolbar.Menu icon="ellipsis" tintColor={colors.label}>
          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction icon="sparkles" onPress={tapHaptic}>
              Get Pro
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction icon="square.and.arrow.up" onPress={tapHaptic}>
              Share
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction icon="airplane" onPress={tapHaptic}>
              Alternate Flights
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.Menu title="Contact Airline" icon="phone">
              <Stack.Toolbar.MenuAction icon="phone" onPress={tapHaptic}>
                {`Call ${airline.name}`}
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction icon="globe" onPress={tapHaptic}>
                Website
              </Stack.Toolbar.MenuAction>
            </Stack.Toolbar.Menu>
            <Stack.Toolbar.Menu title="Open In Maps" icon="map">
              <Stack.Toolbar.MenuAction
                icon="airplane.departure"
                onPress={() => Linking.openURL(`maps://?q=${encodeURIComponent(origin.name)}`)}
              >
                {`Open to ${origin.iata}`}
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction
                icon="airplane.arrival"
                onPress={() => Linking.openURL(`maps://?q=${encodeURIComponent(dest.name)}`)}
              >
                {`Open to ${dest.iata}`}
              </Stack.Toolbar.MenuAction>
            </Stack.Toolbar.Menu>
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction icon="bell.slash" onPress={tapHaptic}>
              Enable Alerts
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction icon="bolt.slash" onPress={tapHaptic}>
              Enable Live Activities
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction icon="person.2" onPress={tapHaptic}>
              Move To Friends
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction icon="exclamationmark.bubble" onPress={tapHaptic}>
              Report Data Issue
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction
              icon="trash"
              destructive
              onPress={() => {
                tapHaptic();
                removeFlight(flight.key);
                router.back();
              }}
            >
              Delete Flight
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          variant="prominent"
          tintColor={colors.blue}
          separateBackground
          onPress={() => {
            tapHaptic();
            router.push({
              pathname: "/add-flight",
              params: { from: dest.iata, to: origin.iata },
            });
          }}
        >
          Add Return
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      ) : null}
      <DetailHeader template={template} dateISO={flight.dateISO} />
      <View style={{ flex: 1, overflow: "hidden" }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <StatusBanner
            headlinePrefix={banner.prefix}
            headlineEmphasis={banner.emphasis}
            body={banner.body}
          />

          <AirportTimesBlock
            direction="departure"
            airport={origin}
            time={formatLocalTime(times.gateDep, origin.tzOffsetMinutes)}
            statusLine={depStatusLine}
            terminal={template.depTerminal}
            gate={template.depGate}
          />
          <RouteMetaRow template={template} />
          <AirportTimesBlock
            direction="arrival"
            airport={dest}
            time={formatLocalTime(times.gateArr, dest.tzOffsetMinutes)}
            dayOffset={template.arrDayOffset}
            statusLine={arrStatusLine}
            terminal={template.arrTerminal}
            gate={template.arrGate}
          />

          <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingTop: 8 }}>
            <EditFieldCard
              icon="ticket"
              title="Booking Code"
              value={flight.bookingCode}
              badge="PASTE"
              onChangeValue={(v) => updateFlight(flight.key, { bookingCode: v })}
            />
            <EditFieldCard
              icon="checkmark"
              title="Seat"
              value={flight.seat}
              onChangeValue={(v) => updateFlight(flight.key, { seat: v })}
            />
          </View>

          <View style={{ paddingTop: 14 }}>
            <GoodToKnowSection template={template} gateArr={times.gateArr} />
          </View>

          <View style={{ paddingTop: 18, gap: 18 }}>
            <ForecastCard
              flightLabel={`${template.airlineIata} ${template.number}`}
              forecast={template.forecast}
            />
            <PlaneCard aircraft={template.aircraft} />
            <InboundTimelineCard template={template} dateISO={flight.dateISO} now={now} />
            <TimetableCard template={template} dateISO={flight.dateISO} />
            <AirlineCard airline={operating ? getAirline(operating.airlineIata) : airline} />
            <RouteHistoryCard fromIata={origin.iata} toIata={dest.iata} />
            <UpdatesCard updates={updates} />
            <NotesCard
              value={flight.notes}
              onChangeValue={(v) => updateFlight(flight.key, { notes: v })}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 10,
              }}
            >
              <SfSymbol name="chevron.right" size={15} tintColor={colors.secondaryLabel} />
              <Text style={{ fontSize: 17, fontWeight: "600", color: colors.secondaryLabel }}>
                Report Data Issue
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
