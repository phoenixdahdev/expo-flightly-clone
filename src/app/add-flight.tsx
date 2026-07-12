import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useReducer, useRef } from "react";
import {
  ActionSheetIOS,
  Keyboard,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ActionRow } from "@/components/add-flight/action-row";
import { AddFlightHeader } from "@/components/add-flight/add-flight-header";
import { AirlineRow } from "@/components/add-flight/airline-row";
import { AirportRow } from "@/components/add-flight/airport-row";
import { DateOptionRow } from "@/components/add-flight/date-option-row";
import { FlightResultRow } from "@/components/add-flight/flight-result-row";
import { ResultsFilterBar } from "@/components/add-flight/results-filter-bar";
import { SearchFieldRow, type Chip } from "@/components/add-flight/search-field-row";
import { SectionHeader } from "@/components/add-flight/section-header";
import { getAirline } from "@/data/airlines";
import { getAirport } from "@/data/airports";
import type { Airport, FlightTemplate } from "@/data/types";
import { findFlightsByRoute } from "@/data/flight-templates";
import { useFlightsStore } from "@/stores/flights-store";
import {
  addDaysISO,
  formatFriendlyDate,
  todayISO,
} from "@/utils/flight-time";
import { successHaptic } from "@/utils/haptics";
import { searchAirports, suggestDestinations } from "@/utils/search";

type Step = "origin" | "destination" | "date" | "results";

interface AddState {
  step: Step;
  query: string;
  origin?: Airport;
  destination?: Airport;
  dateISO?: string;
  showCodeshares: boolean;
  airlineFilter?: string;
}

type AddAction =
  | { type: "setQuery"; q: string }
  | { type: "pickOrigin"; airport: Airport }
  | { type: "pickDestination"; airport: Airport }
  | { type: "pickDate"; dateISO: string }
  | { type: "popTo"; step: Step }
  | { type: "toggleCodeshares" }
  | { type: "setAirlineFilter"; iata?: string };

function reducer(state: AddState, action: AddAction): AddState {
  switch (action.type) {
    case "setQuery":
      return { ...state, query: action.q };
    case "pickOrigin":
      return { ...state, origin: action.airport, query: "", step: "destination" };
    case "pickDestination":
      return { ...state, destination: action.airport, query: "", step: "date" };
    case "pickDate":
      return { ...state, dateISO: action.dateISO, query: "", step: "results" };
    case "popTo":
      if (action.step === "origin") {
        return { ...state, step: "origin", origin: undefined, destination: undefined, dateISO: undefined, query: "" };
      }
      if (action.step === "destination") {
        return { ...state, step: "destination", destination: undefined, dateISO: undefined, query: "" };
      }
      return { ...state, step: "date", dateISO: undefined, query: "" };
    case "toggleCodeshares":
      return { ...state, showCodeshares: !state.showCodeshares };
    case "setAirlineFilter":
      return { ...state, airlineFilter: action.iata };
  }
}

const SUBTITLES: Record<Step, string> = {
  origin: "Enter airline, airport, or flight",
  destination: "Enter arrival city or airport",
  date: "Enter departure date",
  results: "Tap which flight to add",
};

const PLACEHOLDERS: Record<Step, string> = {
  origin: "Flair, YYZ, or F8123",
  destination: "Toronto or YYZ",
  date: "10/5 or Friday",
  results: "",
};

export default function AddFlightScreen() {
  const params = useLocalSearchParams<{ from?: string; to?: string }>();
  const inputRef = useRef<TextInput>(null);
  const addFlight = useFlightsStore((s) => s.addFlight);

  const [state, dispatch] = useReducer(reducer, undefined, () => {
    // "Add Return" entry: /add-flight?from=ICN&to=CGK jumps straight to date.
    if (params.from && params.to) {
      return {
        step: "date" as Step,
        query: "",
        origin: getAirport(params.from),
        destination: getAirport(params.to),
        showCodeshares: true,
      };
    }
    return { step: "origin" as Step, query: "", showCodeshares: true };
  });

  const now = Date.now();
  const today = todayISO(now);

  const chips: Chip[] = [];
  if (state.origin) {
    chips.push({
      label: state.origin.iata || state.origin.icao,
      onPress: () => dispatch({ type: "popTo", step: "origin" }),
    });
  }
  if (state.destination) {
    chips.push({
      label: state.destination.iata || state.destination.icao,
      onPress: () => dispatch({ type: "popTo", step: "destination" }),
    });
  }
  if (state.dateISO && state.step === "results") {
    chips.push({
      label: formatFriendlyDate(state.dateISO),
      onPress: () => dispatch({ type: "popTo", step: "date" }),
    });
  }

  const matches = useMemo(
    () => (state.step === "origin" || state.step === "destination" ? searchAirports(state.query) : []),
    [state.step, state.query]
  );

  const results = useMemo(() => {
    if (state.step !== "results" || !state.origin || !state.destination) return [];
    let flights = findFlightsByRoute(
      state.origin.iata || state.origin.icao,
      state.destination.iata || state.destination.icao
    );
    if (!state.showCodeshares) flights = flights.filter((t) => !t.operatedAs);
    if (state.airlineFilter) flights = flights.filter((t) => t.airlineIata === state.airlineFilter);
    return flights;
  }, [state.step, state.origin, state.destination, state.showCodeshares, state.airlineFilter]);

  const pickResult = (template: FlightTemplate) => {
    if (!state.dateISO) return;
    addFlight(template.id, state.dateISO);
    successHaptic();
    router.back();
  };

  const pickAirlineFilter = () => {
    const { origin, destination } = state;
    if (!origin || !destination) return;
    const airlineIatas = [
      ...new Set(
        findFlightsByRoute(
          origin.iata || origin.icao,
          destination.iata || destination.icao
        ).map((t) => t.airlineIata)
      ),
    ];
    const names = airlineIatas.map((iata) => getAirline(iata).name);
    if (process.env.EXPO_OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["All Airlines", ...names, "Cancel"], cancelButtonIndex: names.length + 1 },
        (index) => {
          if (index === 0) dispatch({ type: "setAirlineFilter", iata: undefined });
          else if (index <= names.length)
            dispatch({ type: "setAirlineFilter", iata: airlineIatas[index - 1] });
        }
      );
    } else {
      // Android: simple cycle through filters.
      const current = state.airlineFilter ? airlineIatas.indexOf(state.airlineFilter) : -1;
      const next = current + 1 >= airlineIatas.length ? undefined : airlineIatas[current + 1];
      dispatch({ type: "setAirlineFilter", iata: next });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <AddFlightHeader subtitle={SUBTITLES[state.step]} />

      {state.step !== "results" ? (
        <SearchFieldRow
          chips={chips}
          query={state.query}
          placeholder={PLACEHOLDERS[state.step]}
          onChangeQuery={(q) => dispatch({ type: "setQuery", q })}
          inputRef={inputRef}
        />
      ) : (
        <SearchFieldRow
          chips={chips}
          query=""
          placeholder=""
          onChangeQuery={() => {}}
          editable={false}
        />
      )}

      <View style={{ flex: 1, overflow: "hidden" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        {/* ORIGIN / DESTINATION: live search results */}
        {(state.step === "origin" || state.step === "destination") && state.query.length > 0 && (
          <Animated.View entering={FadeIn.duration(150)} style={{ paddingTop: 8 }}>
            {matches.map((m, i) => (
              <AirportRow
                key={m.airport.icao}
                airport={m.airport}
                ranges={m.ranges}
                field={m.field}
                showArrowButton={i === 0}
                onPress={() =>
                  dispatch({
                    type: state.step === "origin" ? "pickOrigin" : "pickDestination",
                    airport: m.airport,
                  })
                }
              />
            ))}
          </Animated.View>
        )}

        {/* ORIGIN idle content */}
        {state.step === "origin" && state.query.length === 0 && (
          <View>
            <ActionRow
              icon="arrow.uturn.right"
              title="Return Flight"
              subtitle="LHR → YYZ"
              onPress={() => {}}
            />
            <ActionRow
              icon="airplane"
              title="Alternatives for My Next Flight"
              subtitle="YYZ → LHR • Today"
              onPress={() => {}}
            />
            <SectionHeader title="FREQUENTLY USED" />
            {["F8", "AC"].map((iata) => (
              <AirlineRow key={iata} airline={getAirline(iata)} />
            ))}
            {["YYZ", "YVR"].map((code) => {
              const airport = getAirport(code);
              return (
                <AirportRow
                  key={code}
                  airport={airport}
                  onPress={() => dispatch({ type: "pickOrigin", airport })}
                />
              );
            })}
            <SectionHeader title="MORE" />
            <ActionRow
              icon="point.topleft.down.curvedto.point.bottomright.up"
              title="Find by Route"
            />
            <ActionRow icon="ticket" title="Find by Flight Number" />
            <ActionRow icon="calendar" title="Sync from Calendar" subtitle="Fast, secure, and no setup" />
          </View>
        )}

        {/* DESTINATION suggestions */}
        {state.step === "destination" && state.query.length === 0 && state.origin && (
          <View>
            <SectionHeader title="SUGGESTIONS" />
            {suggestDestinations(state.origin).map((airport, i) => (
              <AirportRow
                key={airport.icao}
                airport={airport}
                showArrowButton={i === 0}
                onPress={() => dispatch({ type: "pickDestination", airport })}
              />
            ))}
          </View>
        )}

        {/* DATE step */}
        {state.step === "date" && (
          <View style={{ paddingTop: 10 }}>
            <DateOptionRow
              icon="checkmark"
              title="Today"
              subtitle={formatFriendlyDate(today)}
              showArrowButton
              onPress={() => {
                Keyboard.dismiss();
                dispatch({ type: "pickDate", dateISO: today });
              }}
            />
            <DateOptionRow
              icon="plus"
              title="Tomorrow"
              subtitle={formatFriendlyDate(addDaysISO(today, 1))}
              onPress={() => {
                Keyboard.dismiss();
                dispatch({ type: "pickDate", dateISO: addDaysISO(today, 1) });
              }}
            />
            <DateOptionRow
              icon="calendar"
              title="Pick from Calendar"
              onPress={() => {
                Keyboard.dismiss();
                dispatch({ type: "pickDate", dateISO: addDaysISO(today, 2) });
              }}
            />
          </View>
        )}

        {/* RESULTS step */}
        {state.step === "results" && state.dateISO && (
          <View>
            <ResultsFilterBar
              showCodeshares={state.showCodeshares}
              airlineFilterLabel={
                state.airlineFilter ? getAirline(state.airlineFilter).name : "All Airlines"
              }
              onToggleCodeshares={() => dispatch({ type: "toggleCodeshares" })}
              onPressAirlines={pickAirlineFilter}
            />
            <View style={{ paddingHorizontal: 12 }}>
              {results.map((template) => (
                <FlightResultRow
                  key={template.id}
                  template={template}
                  dateISO={state.dateISO ?? today}
                  onPress={() => pickResult(template)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      </View>
    </View>
  );
}
