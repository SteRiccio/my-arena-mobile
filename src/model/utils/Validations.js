import { ValidationSeverity } from "@openforis/arena-core";

const customValidationKey = "record.attribute.customValidation";

const getJointTexts = ({ validation, severity, t, customMessageLang }) => {
  const result = [];
  const stack = [];
  stack.push(validation);

  while (stack.length > 0) {
    const v = stack.pop();

    const validationResults =
      severity === ValidationSeverity.error ? v.errors : v.warnings;
    const messages = validationResults.map(({ key, params, messages }) => {
      if (key === customValidationKey) {
        const message = messages[customMessageLang];
        if (message) {
          return message;
        }
      }
      return t(key, params);
    });
    result.push(...messages);

    stack.push(...Object.values(v.fields || {}));
  }

  return result.length > 0 ? result.join(", ") : null;
};

const getJointErrorText = ({ validation, t, customMessageLang }) =>
  getJointTexts({
    validation,
    severity: ValidationSeverity.error,
    t,
    customMessageLang,
  });

const getJointWarningText = ({ validation, t, customMessageLang }) =>
  getJointTexts({
    validation,
    severity: ValidationSeverity.warning,
    t,
    customMessageLang,
  });

export const Validations = {
  getJointErrorText,
  getJointWarningText,
};
