import { Prompt } from "../types/prompt";

export function generateDescription(prompt: Prompt): string {
  const operatorMap: { [key: string]: string } = {
    ">": "more than",
    ">=": "at least",
    "<": "less than",
    "<=": "at most",
  };

  const descriptions = prompt.criteria.map(
    (criterion) =>
      `Players who averaged ${operatorMap[criterion.operator]} ${criterion.value} ${criterion.stat}`
  );

  return descriptions.join(
    prompt.logicalOperator === "OR" ? " or " : " and "
  );
}
