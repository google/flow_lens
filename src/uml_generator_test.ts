import "jasmine";

import { ParsedFlow, Transition } from "./flow_parser";
import * as flowTypes from "./flow_types";
import { UmlGenerator } from "./uml_generator";

const EOL = Deno.build.os === "windows" ? "\r\n" : "\n";
const TRANSITION_ARROW = "-->";

const NODE_NAMES = {
  label: "test",
  start: "start",
  apexPluginCall: "myApexPluginCall",
  assignment: "myAssignment",
  collectionProcessor: "myCollectionProcessor",
  decision: "myDecision",
  loop: "myLoop",
  orchestratedStage: "myOrchestratedStage",
  recordCreate: "myRecordCreate",
  recordDelete: "myRecordDelete",
  recordLookup: "myRecordLookup",
  recordRollback: "myRecordRollback",
  recordUpdate: "myRecordUpdate",
  screen: "myScreen",
  step: "myStep",
  subflow: "mySubflow",
  transform: "myTransform",
  wait: "myWait",
  actionCall: "myActionCall",
};

const UML_REPRESENTATIONS = {
  apexPluginCall: (name: string) => `state ApexPluginCall ${name}`,
  assignment: (name: string) => `state Assignment ${name}`,
  collectionProcessor: (name: string) => `state CollectionProcessor ${name}`,
  decision: (name: string) => `state Decision ${name}`,
  loop: (name: string) => `state Loop ${name}`,
  orchestratedStage: (name: string) => `state OrchestratedStage ${name}`,
  recordCreate: (name: string) => `state RecordCreate ${name}`,
  recordDelete: (name: string) => `state RecordDelete ${name}`,
  recordLookup: (name: string) => `state RecordLookup ${name}`,
  recordRollback: (name: string) => `state RecordRollback ${name}`,
  recordUpdate: (name: string) => `state RecordUpdate ${name}`,
  screen: (name: string) => `state Screen ${name}`,
  step: (name: string) => `state Step ${name}`,
  subflow: (name: string) => `state Subflow ${name}`,
  transform: (name: string) => `state Transform ${name}`,
  wait: (name: string) => `state Wait ${name}`,
  actionCall: (name: string) => `state ActionCall ${name}`,
  transition: (from: string, to: string) => `${from} ${TRANSITION_ARROW} ${to}`,
};

function generateMockFlow() {
  return {
    label: NODE_NAMES.label,
    start: {
      name: NODE_NAMES.start,
    } as flowTypes.FlowStart,
    apexPluginCalls: getFlowNodes(
      NODE_NAMES.apexPluginCall
    ) as flowTypes.FlowApexPluginCall[],
    assignments: getFlowNodes(
      NODE_NAMES.assignment
    ) as flowTypes.FlowAssignment[],
    collectionProcessors: getFlowNodes(
      NODE_NAMES.collectionProcessor
    ) as flowTypes.FlowCollectionProcessor[],
    decisions: getFlowNodes(NODE_NAMES.decision) as flowTypes.FlowDecision[],
    loops: getFlowNodes(NODE_NAMES.loop) as flowTypes.FlowLoop[],
    orchestratedStages: getFlowNodes(
      NODE_NAMES.orchestratedStage
    ) as flowTypes.FlowOrchestratedStage[],
    recordCreates: getFlowNodes(
      NODE_NAMES.recordCreate
    ) as flowTypes.FlowRecordCreate[],
    recordDeletes: getFlowNodes(
      NODE_NAMES.recordDelete
    ) as flowTypes.FlowRecordDelete[],
    recordLookups: getFlowNodes(
      NODE_NAMES.recordLookup
    ) as flowTypes.FlowRecordLookup[],
    recordRollbacks: getFlowNodes(
      NODE_NAMES.recordRollback
    ) as flowTypes.FlowRecordRollback[],
    recordUpdates: getFlowNodes(
      NODE_NAMES.recordUpdate
    ) as flowTypes.FlowRecordUpdate[],
    screens: getFlowNodes(NODE_NAMES.screen) as flowTypes.FlowScreen[],
    steps: getFlowNodes(NODE_NAMES.step) as flowTypes.FlowStep[],
    subflows: getFlowNodes(NODE_NAMES.subflow) as flowTypes.FlowSubflow[],
    transforms: getFlowNodes(NODE_NAMES.transform) as flowTypes.FlowTransform[],
    waits: getFlowNodes(NODE_NAMES.wait) as flowTypes.FlowWait[],
    actionCalls: getFlowNodes(
      NODE_NAMES.actionCall
    ) as flowTypes.FlowActionCall[],
    transitions: [
      {
        from: NODE_NAMES.start,
        to: NODE_NAMES.apexPluginCall,
        fault: false,
      },
      {
        from: NODE_NAMES.apexPluginCall,
        to: NODE_NAMES.assignment,
        fault: false,
      },
      {
        from: NODE_NAMES.assignment,
        to: NODE_NAMES.collectionProcessor,
        fault: false,
      },
    ],
  };
}

function getFlowNodes(name: string): flowTypes.FlowNode[] {
  return [{ name: `${name}` }] as flowTypes.FlowNode[];
}

describe("UmlGenerator", () => {
  let systemUnderTest: UmlGenerator;
  let mockParsedFlow: ParsedFlow;

  beforeEach(() => {
    mockParsedFlow = generateMockFlow();

    class ConcreteUmlGenerator extends UmlGenerator {
      getHeader(label: string): string {
        return label;
      }
      getFlowApexPluginCall(node: flowTypes.FlowApexPluginCall): string {
        return UML_REPRESENTATIONS.apexPluginCall(node.name);
      }
      getFlowAssignment(node: flowTypes.FlowAssignment): string {
        return UML_REPRESENTATIONS.assignment(node.name);
      }
      getFlowCollectionProcessor(
        node: flowTypes.FlowCollectionProcessor
      ): string {
        return UML_REPRESENTATIONS.collectionProcessor(node.name);
      }
      getFlowDecision(node: flowTypes.FlowDecision): string {
        return UML_REPRESENTATIONS.decision(node.name);
      }
      getFlowLoop(node: flowTypes.FlowLoop): string {
        return UML_REPRESENTATIONS.loop(node.name);
      }
      getFlowOrchestratedStage(node: flowTypes.FlowOrchestratedStage): string {
        return UML_REPRESENTATIONS.orchestratedStage(node.name);
      }
      getFlowRecordCreate(node: flowTypes.FlowRecordCreate): string {
        return UML_REPRESENTATIONS.recordCreate(node.name);
      }
      getFlowRecordDelete(node: flowTypes.FlowRecordDelete): string {
        return UML_REPRESENTATIONS.recordDelete(node.name);
      }
      getFlowRecordLookup(node: flowTypes.FlowRecordLookup): string {
        return UML_REPRESENTATIONS.recordLookup(node.name);
      }
      getFlowRecordRollback(node: flowTypes.FlowRecordRollback): string {
        return UML_REPRESENTATIONS.recordRollback(node.name);
      }
      getFlowRecordUpdate(node: flowTypes.FlowRecordUpdate): string {
        return UML_REPRESENTATIONS.recordUpdate(node.name);
      }
      getFlowScreen(node: flowTypes.FlowScreen): string {
        return UML_REPRESENTATIONS.screen(node.name);
      }
      getFlowStep(node: flowTypes.FlowStep): string {
        return UML_REPRESENTATIONS.step(node.name);
      }
      getFlowSubflow(node: flowTypes.FlowSubflow): string {
        return UML_REPRESENTATIONS.subflow(node.name);
      }
      getFlowTransform(node: flowTypes.FlowTransform): string {
        return UML_REPRESENTATIONS.transform(node.name);
      }
      getFlowWait(node: flowTypes.FlowWait): string {
        return UML_REPRESENTATIONS.wait(node.name);
      }
      getFlowActionCall(node: flowTypes.FlowActionCall): string {
        return UML_REPRESENTATIONS.actionCall(node.name);
      }
      getTransition(transition: Transition): string {
        return UML_REPRESENTATIONS.transition(transition.from, transition.to);
      }
      getFooter(): string {
        return "";
      }
    }

    systemUnderTest = new ConcreteUmlGenerator(mockParsedFlow);
  });

  it("should generate UML with all flow elements", () => {
    const uml = systemUnderTest.generateUml();

    const expectedUml = [
      NODE_NAMES.label,
      UML_REPRESENTATIONS.apexPluginCall(NODE_NAMES.apexPluginCall),
      UML_REPRESENTATIONS.assignment(NODE_NAMES.assignment),
      UML_REPRESENTATIONS.collectionProcessor(NODE_NAMES.collectionProcessor),
      UML_REPRESENTATIONS.decision(NODE_NAMES.decision),
      UML_REPRESENTATIONS.loop(NODE_NAMES.loop),
      UML_REPRESENTATIONS.orchestratedStage(NODE_NAMES.orchestratedStage),
      UML_REPRESENTATIONS.recordCreate(NODE_NAMES.recordCreate),
      UML_REPRESENTATIONS.recordDelete(NODE_NAMES.recordDelete),
      UML_REPRESENTATIONS.recordLookup(NODE_NAMES.recordLookup),
      UML_REPRESENTATIONS.recordRollback(NODE_NAMES.recordRollback),
      UML_REPRESENTATIONS.recordUpdate(NODE_NAMES.recordUpdate),
      UML_REPRESENTATIONS.screen(NODE_NAMES.screen),
      UML_REPRESENTATIONS.step(NODE_NAMES.step),
      UML_REPRESENTATIONS.subflow(NODE_NAMES.subflow),
      UML_REPRESENTATIONS.transform(NODE_NAMES.transform),
      UML_REPRESENTATIONS.wait(NODE_NAMES.wait),
      UML_REPRESENTATIONS.actionCall(NODE_NAMES.actionCall),
      UML_REPRESENTATIONS.transition(
        NODE_NAMES.start,
        NODE_NAMES.apexPluginCall
      ),
      UML_REPRESENTATIONS.transition(
        NODE_NAMES.apexPluginCall,
        NODE_NAMES.assignment
      ),
      UML_REPRESENTATIONS.transition(
        NODE_NAMES.assignment,
        NODE_NAMES.collectionProcessor
      ),
    ].join(EOL);

    expect(uml).toEqual(expectedUml);
  });

  it("should handle empty flow elements", () => {
    mockParsedFlow.screens = [];

    const uml = systemUnderTest.generateUml();

    expect(uml).not.toContain(UML_REPRESENTATIONS.screen(NODE_NAMES.screen));
  });

  it("should handle undefined flow elements", () => {
    mockParsedFlow.screens = undefined;

    const uml = systemUnderTest.generateUml();

    expect(uml).not.toContain(UML_REPRESENTATIONS.screen(NODE_NAMES.screen));
  });

  it("should handle empty transitions", () => {
    mockParsedFlow.transitions = [];
    const uml = systemUnderTest.generateUml();

    expect(uml).not.toContain(TRANSITION_ARROW);
  });

  it("should handle undefined transitions", () => {
    mockParsedFlow.transitions = undefined;
    const uml = systemUnderTest.generateUml();

    expect(uml).not.toContain(TRANSITION_ARROW);
  });
});
