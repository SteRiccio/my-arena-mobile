export default {
  appErrors: {
    generic: "Unexpected error: {{text}}",
  },
  record: {
    ancestorNotFound: "Ancestor node not found in record",
    keyDuplicate: "Duplicate record key",
    oneOrMoreInvalidValues: "One or more values are invalid",
    uniqueAttributeDuplicate: "Duplicate value",

    attribute: {
      customValidation: "Invalid value",
      uniqueDuplicate: "Duplicate value",
      valueInvalid: "Invalid value",
      valueRequired: "Required value",
    },
    entity: {
      keyDuplicate: "Duplicate entity key",
      keyValueNotSpecified:
        "Key value for attribute {{keyDefName}} not specified",
    },
    nodes: {
      count: {
        invalid: "{{nodeDefName}} nodes must be exactly {{count}}",
        maxExceeded:
          "{{nodeDefName}} nodes must be less than or equal to {{maxCount}}",
        minNotReached:
          "{{nodeDefName}} nodes must be more than or equal to {{minCount}}",
      },
    },
  },
};
