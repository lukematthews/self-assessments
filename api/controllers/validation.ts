import Joi from "joi";
import { isValidObjectId } from "mongoose";
import express, { RequestHandler } from "express";

const objectIdValidator = (value: any, helper: Joi.CustomHelpers, message:string) => {
  if (!isValidObjectId(value)) {
    return helper.message({ custom: message });
  }
  return value;
};

const criteriaIdValidator = (value: any, helper: Joi.CustomHelpers) => {
    return objectIdValidator(value, helper, "Criteria ID is invalid");
}

export const createAssessmentRequestSchema = Joi.object({
  assessmentDate: Joi.date().required(),
  value: Joi.string().required(),
  criteriaId: Joi.string().custom(criteriaIdValidator),
});

export function validate(schema: Joi.Schema, content: any, res: express.Response) {
  const result = schema.validate(content, { abortEarly: false });
  if (result.error) {
    return res.status(400).json({ errors: result.error });
  } else {
    return result;
  }
}
