import { assertEquals } from "@std/assert";

import { compareFlows } from "../main/flow_comparator.ts";
import { ParsedFlow } from "../main/flow_parser.ts";
import * as flowTypes from "../main/flow_types.ts";

const NODE = {
  name: "node",
  type: "type",
  label: "label",
  elementSubtype: "elementSubtype",
  locationX: 0,
  locationY: 0,
  description: "description",
};
const NODE_MODIFIED = {
  name: "node",
  type: "type",
  label: "label",
  elementSubtype: "elementSubtype",
  locationX: 1,
  locationY: 1,
  description: "description_modified",
};

function createParsedFlow(nodes: flowTypes.FlowNode[]): ParsedFlow {
  return {
    nameToNode: new Map<string, flowTypes.FlowNode>(
      nodes.map((node) => [node.name, node])
    ),
  };
}

Deno.test("compareFlows should set the diff status of a deleted node", () => {
  const oldFlow: ParsedFlow = createParsedFlow([NODE]);
  const newFlow: ParsedFlow = createParsedFlow([]);

  compareFlows(oldFlow, newFlow);

  const oldNode = oldFlow.nameToNode?.get(NODE.name);
  assertEquals(oldNode != null, true);
  assertEquals(oldNode!.diffStatus, flowTypes.DiffStatus.DELETED);
});

Deno.test("compareFlows should set the diff status of a modified node", () => {
  const oldFlow: ParsedFlow = createParsedFlow([NODE]);
  const newFlow: ParsedFlow = createParsedFlow([NODE_MODIFIED]);

  compareFlows(oldFlow, newFlow);

  const oldNode = oldFlow.nameToNode?.get(NODE.name);
  const newNode = newFlow.nameToNode?.get(NODE_MODIFIED.name);

  assertEquals(oldNode != null, true);
  assertEquals(newNode != null, true);
  assertEquals(oldNode?.diffStatus, flowTypes.DiffStatus.MODIFIED);
  assertEquals(newNode?.diffStatus, flowTypes.DiffStatus.MODIFIED);
});

Deno.test("compareFlows should set the diff status of an added node", () => {
  const oldFlow: ParsedFlow = createParsedFlow([]);
  const newFlow: ParsedFlow = createParsedFlow([NODE]);

  compareFlows(oldFlow, newFlow);

  const newNode = newFlow.nameToNode?.get(NODE.name);
  assertEquals(newNode != null, true);
  assertEquals(newNode?.diffStatus, flowTypes.DiffStatus.ADDED);
});
