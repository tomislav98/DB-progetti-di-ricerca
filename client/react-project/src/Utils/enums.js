export const ProjectStatus = {
  APPROVED: 0,
  SUBMITTED: 1,
  REQUIRES_CHANGES: 2,
  NOT_APPROVED: 3,
  TO_BE_SUBMITTED: 4,
};

export const DocumentType = {
  DATA_MANAGEMENT_PLAN: 0,
  ETHICS_DELIVERABLE: 1,
  SCIENTIFIC_REPORT: 2,
  FINANCIAL_BUDGET: 3,
  COMMUNICATION_DISSEMINATION_PLAN: 4,
  RISK_ANALYSIS: 5,
  LETTERS_OF_SUPPORT_COLLABORATION: 6,
  ETHICS_PLAN: 7,
  CV_PRINCIPAL_INVESTIGATORS: 8,
  LEGAL_DOCUMENTS: 9,
  PROGRESS_REPORTS: 10,
  UNDEFINED: 11,

  getStringFromValue: function (value) {
    const key = Object.keys(this).find(key => this[key] === value);
    return key || null;
  },
};
