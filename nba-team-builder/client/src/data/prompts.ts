import { Prompt } from "../types/prompt";

const prompts: Prompt[] = [
  {
    id: "0",
    criteria: [
      { stat: "PTS", operator: ">", value: 10 },
    ],
  },
  {
    id: "1",
    criteria: [
      { stat: "AST", operator: ">", value: 3 },
    ],
  },
  {
    id: "2",
    criteria: [
      { stat: "BLK", operator: ">=", value: 1 },
    ],
  },
  {
    id: "3",
    criteria: [
      { stat: "PTS", operator: ">", value: 5 },
      { stat: "PTS", operator: "<", value: 10 },
    ],
    logicalOperator: "AND",
  },
  {
    id: "4",
    criteria: [
      { stat: "PTS", operator: ">=", value: 1 },
    ],
  },
];

export default prompts;
