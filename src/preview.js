import {
  constellationResponse,
  echoResponse,
  helpResponse,
  launchResponse,
  linksResponse,
  projectResponse,
  randomSignal,
  residueResponse,
  symbolResponse,
  trackResponse,
} from "./responders.js";

const samples = [
  ["signal", randomSignal()],
  ["track 08", trackResponse("08")],
  ["constellation", constellationResponse()],
  ["symbol birds", symbolResponse("birds")],
  ["residue", residueResponse()],
  ["echo", echoResponse("you still there?")],
  ["humanexe", projectResponse()],
  ["launch", launchResponse()],
  ["echohelp", helpResponse()],
  ["links", linksResponse()],
];

for (const [label, response] of samples) {
  console.log(`\n--- ${label} ---\n${response}`);
}
