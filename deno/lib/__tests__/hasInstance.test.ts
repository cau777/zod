import * as z from "../index.ts";

test("ZodType hasInstance should return true for same schema", () => {
  expect(z.object({}) instanceof z.ZodObject).toBeTruthy();
  expect(z.object({ prop: z.number() }) instanceof z.ZodObject).toBeTruthy();
  expect(z.literal("TEST") instanceof z.ZodLiteral).toBeTruthy();
  expect(z.union([z.number(), z.string()]) instanceof z.ZodUnion).toBeTruthy();
  expect(
    z.intersection(z.literal("TEST"), z.string()) instanceof z.ZodIntersection
  ).toBeTruthy();
  expect(z.ZodNumber.create() instanceof z.ZodNumber).toBeTruthy();
});

test("ZodType hasInstance should return false for different schemas", () => {
  expect(z.string() instanceof z.ZodObject).toBeFalsy();
  expect(z.object({ prop: z.number() }) instanceof z.ZodNumber).toBeFalsy();
  expect(z.number().optional() instanceof z.ZodNumber).toBeFalsy();
  expect(z.number().nullable() instanceof z.ZodOptional).toBeFalsy();
  expect(z.literal("TEST") instanceof z.ZodString).toBeFalsy();
  expect(
    z.discriminatedUnion("type", [
      z.object({ type: z.literal("a") }),
      z.object({ type: z.literal("b") }),
    ]) instanceof z.ZodUnion
  ).toBeFalsy();
});
test("ZodType hasInstance should check for inherited schemas", () => {
  class CustomZodType extends z.ZodObject<any> {}
  class InheritedCustomZodType extends CustomZodType {}

  const customZodType: unknown = new CustomZodType({} as any);
  const inheritedZodType: unknown = new InheritedCustomZodType({} as any);

  expect(z.object({}) instanceof z.ZodType).toBeTruthy();
  expect(customZodType instanceof z.ZodObject).toBeTruthy();
  expect(customZodType instanceof CustomZodType).toBeTruthy();
  expect(customZodType instanceof InheritedCustomZodType).toBeFalsy();

  expect(inheritedZodType instanceof z.ZodObject).toBeTruthy();
  expect(inheritedZodType instanceof CustomZodType).toBeTruthy();
  expect(inheritedZodType instanceof InheritedCustomZodType).toBeTruthy();
  expect(inheritedZodType instanceof z.ZodNull).toBeFalsy();
});
