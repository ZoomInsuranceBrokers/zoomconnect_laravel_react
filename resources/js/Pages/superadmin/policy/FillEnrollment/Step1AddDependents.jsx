// resources/js/Pages/Enrollment/Step1AddDependents.jsx
import React, { useEffect, useState, useRef } from "react";
import { router } from "@inertiajs/react";
/**
 * Step1AddDependents.jsx
 *
 * - Single-file combined UI for Step 1 (Add dependents) and Add/Edit modal.
 * - Preserves your Tailwind styles and icons.
 * - Frontend-only state saved to localStorage ("zoomconnect_dependents").
 * - Calls updateFormData({ dependents }) when dependents change (if provided).
 * - Navigates to Step 2 using onNext() prop if provided, otherwise router.visit('/enrollment/step2').
 *
 * Usage:
 * <Step1AddDependents
 *   employee={employee}
 *   enrollmentDetail={enrollmentDetail}
 *   familyDefinition={familyDefinition}
 *   formData={formData}
 *   updateFormData={updateFormData}
 *   onNext={() => router.visit('/enrollment/step2')}
 * />
 *
 * Notes:
 * - This file intentionally keeps variable names and UI markup similar to what you provided.
 */

// -----------------------
// Small utility: toast
// -----------------------
function showToast(message, duration = 3000) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "32px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "rgba(60,16,80,0.95)";
  toast.style.color = "#fff";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "1rem";
  toast.style.zIndex = 9999;
  toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, duration);
}

// -----------------------
// Icons / image paths
// -----------------------
const FamilyIcons = {
  SELF: "/assets/images/enrolment/self.png",
  SPOUSE: "/assets/images/enrolment/spouse.png",
  SON: "/assets/images/enrolment/kids.png",
  DAUGHTER: "/assets/images/enrolment/kids.png",
  FATHER: "/assets/images/enrolment/parents.png",
  MOTHER: "/assets/images/enrolment/parents.png",
  FATHER_IN_LAW: "/assets/images/enrolment/parents.png",
  MOTHER_IN_LAW: "/assets/images/enrolment/parents.png",
  SIBLING: "/assets/images/enrolment/siblings.png",
  PARTNERS: "/assets/images/enrolment/spouse.png",
  OTHERS: "/assets/images/enrolment/others.png",
};

// -----------------------
// Helpers: parse & normalize familyDefinition
// Accepts string or object. Normalizes keys used by this component.
// -----------------------
function safeJSONParse(val) {
  if (!val) return null;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
}

function parseBoolish(v) {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  if (v === false || v === "false" || v === 0 || v === "0") return false;
  return null;
}

function normalizeFamilyDefinition(fdRaw) {
  const fd = safeJSONParse(fdRaw) || {};
  const toInt = (v, fallback = null) => {
    if (v === undefined || v === null || v === "") return fallback;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? fallback : n;
  };

  // relation parser: can be '1'/'0' or object
  const parseRel = (key) => {
    const raw = fd[key];
    if (raw === undefined || raw === null) {
      return { enabled: false, no: 0, min_age: null, max_age: null, gender: "both" };
    }
    if (typeof raw === "object") {
      return {
        enabled: parseBoolish(raw.enabled) === true,
        no: toInt(raw.no, 0),
        min_age: toInt(raw.min_age, null),
        max_age: toInt(raw.max_age, null),
        gender: raw.gender || "both",
      };
    }
    // primitive values '1' or '0' or numbers
    if (raw === "1" || raw === 1) return { enabled: true, no: 1, min_age: null, max_age: null, gender: "both" };
    return { enabled: false, no: 0, min_age: null, max_age: null, gender: "both" };
  };

  const normalized = {
    self: parseRel("self"),
    spouse: parseRel("spouse"),
    kids: parseRel("kids" in fd ? "kids" : "kid" in fd ? "kid" : "children"),
    parent: parseRel("parent"),
    parent_in_law: parseRel("parent_in_law"),
    sibling: parseRel("sibling"),
    partners: parseRel("partners"),
    others: parseRel("others"),
    // legacy flattened keys support
    self_no: toInt(fd.self_no, null),
    spouse_no: toInt(fd.spouse_no, null),
    kids_no: toInt(fd.kids_no || fd.kid_no, null),
    parent_no: toInt(fd.parent_no, null),
    parent_in_law_no: toInt(fd.parent_in_law_no, null),
    // min/max flattened
    self_min_age: toInt(fd.self_min_age, null),
    self_max_age: toInt(fd.self_max_age, null),
    spouse_min_age: toInt(fd.spouse_min_age, null),
    spouse_max_age: toInt(fd.spouse_max_age, null),
    kids_min_age: toInt(fd.kids_min_age || fd.kid_min_age, null),
    kids_max_age: toInt(fd.kids_max_age || fd.kid_max_age, null),
    parent_min_age: toInt(fd.parent_min_age, null),
    parent_max_age: toInt(fd.parent_max_age, null),
    parent_in_law_min_age: toInt(fd.parent_in_law_min_age, null),
    parent_in_law_max_age: toInt(fd.parent_in_law_max_age, null),
    // combination rule and spouse rule
    add_both_parent_n_parent_in_law: (fd.add_both_parent_n_parent_in_law || "both").toString(),
    // spouse_with_same_gender may be "allowed" or "null" (string) per your input
    spouse_with_same_gender: (function () {
      const v = fd.spouse_with_same_gender;
      if (v === "allowed" || v === "true" || v === true || v === "1" || v === 1) return "allowed";
      return "not_allowed";
    })(),
    // raw
    _raw: fd,
  };

  // set specific .no defaults when missing
  if (normalized.self_no !== null) normalized.self.no = normalized.self_no;
  if (normalized.spouse_no !== null) normalized.spouse.no = normalized.spouse_no;
  if (normalized.kids_no !== null) normalized.kids.no = normalized.kids_no;
  if (normalized.parent_no !== null) normalized.parent.no = normalized.parent_no;
  if (normalized.parent_in_law_no !== null) normalized.parent_in_law.no = normalized.parent_in_law_no;

  // fallback sensible values
  if (normalized.self.no === undefined || normalized.self.no === null) normalized.self.no = 1;
  if (normalized.spouse.no === undefined || normalized.spouse.no === null) normalized.spouse.no = 1;
  if (normalized.kids.no === undefined || normalized.kids.no === null) normalized.kids.no = 0;

  // min/max override from flattened keys if present
  if (normalized.self_min_age !== null) normalized.self.min_age = normalized.self_min_age;
  if (normalized.self_max_age !== null) normalized.self.max_age = normalized.self_max_age;
  if (normalized.spouse_min_age !== null) normalized.spouse.min_age = normalized.spouse_min_age;
  if (normalized.spouse_max_age !== null) normalized.spouse.max_age = normalized.spouse_max_age;
  if (normalized.kids_min_age !== null) normalized.kids.min_age = normalized.kids_min_age;
  if (normalized.kids_max_age !== null) normalized.kids.max_age = normalized.kids_max_age;

  return normalized;
}

// -----------------------
// Age helper
// -----------------------
function calculateAgeFromDOB(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// -----------------------
// Add/Edit Modal Component (embedded)
// -----------------------
function AddDependentModal({
  isOpen,
  onClose,
  onSave,
  relationOptions,
  familyDefNormalized,
  dependents,
  initialData,
  employee,
}) {
  const [formData, setFormData] = useState({
    insured_name: "",
    relation: "",
    detailed_relation: "",
    gender: "",
    dob: "",
    age: "",
  });
  const [errors, setErrors] = useState({});

  const isEdit = !!initialData;
  const isSelfEdit = isEdit && initialData?.relation === "SELF";

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit) {
      // populate fields from initialData (respect employee for self)
      if (initialData.relation === "SELF") {
        setFormData({
          insured_name: employee?.full_name || initialData.insured_name || "",
          relation: "SELF",
          detailed_relation: "Self",
          gender: employee?.gender ? String(employee.gender).toUpperCase() : "",
          dob: initialData.dob ? new Date(initialData.dob).toISOString().split("T")[0] : "",
          age: initialData.age || (initialData.dob ? calculateAgeFromDOB(initialData.dob) : ""),
        });
      } else {
        setFormData({
          insured_name: initialData.insured_name || "",
          relation: initialData.relation || "",
          detailed_relation: initialData.detailed_relation || "",
          gender: initialData.gender ? String(initialData.gender).toUpperCase() : "",
          dob: initialData.dob ? new Date(initialData.dob).toISOString().split("T")[0] : "",
          age: initialData.age || (initialData.dob ? calculateAgeFromDOB(initialData.dob) : ""),
        });
      }
    } else {
      setFormData({
        insured_name: "",
        relation: "",
        detailed_relation: "",
        gender: "",
        dob: "",
        age: "",
      });
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEdit, initialData, employee]);

  const calcAge = (value) => {
    if (!value) return "";
    return calculateAgeFromDOB(value);
  };

  const updateFormData = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (field === "dob") updated.age = calcAge(value);
    if (field === "gender" && value) updated.gender = String(value).toUpperCase();
    setFormData(updated);
  };

  function getRelationAgeLimits(relation) {
    if (!relation) return { min: null, max: null };
    const fam = familyDefNormalized;
    switch (relation) {
      case "SON":
      case "DAUGHTER":
      case "KID":
        return { min: fam.kids.min_age ?? fam.kids_min_age ?? null, max: fam.kids.max_age ?? fam.kids_max_age ?? null };
      case "FATHER":
      case "MOTHER":
        return { min: fam.parent.min_age ?? fam.parent_min_age ?? null, max: fam.parent.max_age ?? fam.parent_max_age ?? null };
      case "FATHER_IN_LAW":
      case "MOTHER_IN_LAW":
        return { min: fam.parent_in_law.min_age ?? fam.parent_in_law_min_age ?? null, max: fam.parent_in_law.max_age ?? fam.parent_in_law_max_age ?? null };
      case "SPOUSE":
        return { min: fam.spouse.min_age ?? fam.spouse_min_age ?? null, max: fam.spouse.max_age ?? fam.spouse_max_age ?? null };
      case "SELF":
        return { min: fam.self.min_age ?? fam.self_min_age ?? null, max: fam.self.max_age ?? fam.self_max_age ?? null };
      default:
        return { min: null, max: null };
    }
  }

  function checkParentCombination(candidate, currentDependents, fam = familyDefNormalized, editingId = null) {
    const rule = fam.add_both_parent_n_parent_in_law || "both";
    if (rule === "both") return null;
    const would = currentDependents.filter(d => (editingId ? d.id !== editingId : true)).map(d => d.relation);
    if (candidate && candidate.relation) would.push(candidate.relation);
    const parentCount = would.filter(r => r === "FATHER" || r === "MOTHER").length;
    const inLawCount = would.filter(r => r === "FATHER_IN_LAW" || r === "MOTHER_IN_LAW").length;
    if (rule === "either" && parentCount > 0 && inLawCount > 0) return "Policy allows either parent or parent-in-law, not both.";
    if (rule === "cross_combination" && parentCount + inLawCount > 2) return "Policy allows maximum 2 combined parents / parents-in-law.";
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.insured_name || !formData.insured_name.trim()) newErrors.insured_name = "Name is required";
    if (!formData.relation) newErrors.relation = "Relationship is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";

    // Age checks
    if (formData.relation && formData.dob) {
      const limits = getRelationAgeLimits(formData.relation);
      const age = calcAge(formData.dob);
      if (limits && limits.min !== null && typeof limits.min === "number" && age < limits.min) {
        newErrors.dob = `Minimum age for ${formData.relation} is ${limits.min}`;
      }
      if (limits && limits.max !== null && typeof limits.max === "number" && age > limits.max) {
        newErrors.dob = `Maximum age for ${formData.relation} is ${limits.max}`;
      }
    }

    // parent gender enforcement
    if (formData.relation === "FATHER" && formData.gender !== "MALE") newErrors.gender = "Father must be male.";
    if (formData.relation === "MOTHER" && formData.gender !== "FEMALE") newErrors.gender = "Mother must be female.";
    if (formData.relation === "FATHER_IN_LAW" && formData.gender !== "MALE") newErrors.gender = "Father-in-law must be male.";
    if (formData.relation === "MOTHER_IN_LAW" && formData.gender !== "FEMALE") newErrors.gender = "Mother-in-law must be female.";

    // per-relation counts & kids total
    if (formData.relation) {
      const relationMeta = relationOptions.find(r => r.value === formData.relation);
      if (relationMeta) {
        const currentCount = dependents.filter(d => d.relation === formData.relation && (!isEdit || d.id !== (initialData && initialData.id))).length;
        if (!isEdit && currentCount >= relationMeta.maxCount) newErrors.relation = `${relationMeta.label} limit reached`;

        // total kids (SON + DAUGHTER) enforcement
        if ((formData.relation === "SON" || formData.relation === "DAUGHTER") && (familyDefNormalized.kids.no || familyDefNormalized.kids_no)) {
          const kidsLimit = familyDefNormalized.kids.no || familyDefNormalized.kids_no || 0;
          const sonCount = dependents.filter(d => d.relation === "SON" && (!isEdit || d.id !== (initialData && initialData.id))).length;
          const daughterCount = dependents.filter(d => d.relation === "DAUGHTER" && (!isEdit || d.id !== (initialData && initialData.id))).length;
          const newTotalKids = sonCount + daughterCount + 1;
          if (kidsLimit && newTotalKids > kidsLimit) newErrors.relation = `You can only add up to ${kidsLimit} children (son + daughter)`;
        }
      }
    }

    // kids gender enforcement (son male, daughter female) — keep strict as requested
    if (formData.relation === "SON" && String(formData.gender).toUpperCase() !== "MALE") newErrors.gender = "Son must be male.";
    if (formData.relation === "DAUGHTER" && String(formData.gender).toUpperCase() !== "FEMALE") newErrors.gender = "Daughter must be female.";

    // spouse same-gender rule (use normalized field)
    if (formData.relation === "SPOUSE") {
      const allowSame = familyDefNormalized.spouse_with_same_gender === "allowed";
      const empGender = employee && employee.gender ? String(employee.gender).toUpperCase() : null;
      const spouseGender = formData.gender ? String(formData.gender).toUpperCase() : null;
      if (!allowSame && empGender && spouseGender && empGender === spouseGender) {
        newErrors.gender = "Same-gender spouse is not allowed as per policy.";
      }
    }

    // parent vs parent_in_law combo
    const comboError = checkParentCombination(formData, dependents, familyDefNormalized, isEdit ? initialData.id : null);
    if (comboError) newErrors.relation = comboError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      id: isEdit ? initialData.id : Date.now(),
      detailed_relation: formData.detailed_relation || (relationOptions.find(r => r.value === formData.relation)?.label || ""),
      age: formData.age || (formData.dob ? calculateAgeFromDOB(formData.dob) : null),
    };

    // final checks (spouse)
    if (payload.relation === "SPOUSE") {
      const allowSame = familyDefNormalized.spouse_with_same_gender === "allowed";
      const empGender = employee && employee.gender ? String(employee.gender).toUpperCase() : null;
      const spouseGender = payload.gender ? String(payload.gender).toUpperCase() : null;
      if (!allowSame && empGender && spouseGender && empGender === spouseGender) {
        setErrors(prev => ({ ...prev, gender: "Same-gender spouse is not allowed as per policy." }));
        return;
      }
    }
    // parent combo re-check
    const comboError2 = checkParentCombination(payload, dependents, familyDefNormalized, isEdit ? initialData.id : null);
    if (comboError2) {
      setErrors(prev => ({ ...prev, relation: comboError2 }));
      return;
    }

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  // Build modal relation options while rendering (disable when full)
  const modalRelationOptions = relationOptions.map(opt => {
    const currentCount = dependents.filter(d => d.relation === opt.value).length;
    const isCurrent = isEdit && initialData && initialData.relation === opt.value;
    let shouldDisable = false;
    if (isEdit) shouldDisable = !isCurrent && currentCount >= opt.maxCount;
    else shouldDisable = opt.maxCount === 0 || currentCount >= opt.maxCount;
    return { ...opt, disabled: shouldDisable };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#934790] to-[#7a3d7a] px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{isEdit ? "Edit Family Member" : "Add Family Member"}</h3>
                <p className="text-white/80 text-xs">Add or update a dependent for this insurance policy</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Family Definition Statement / Who can you add */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">Who can you add to this policy?</h4>
              <div className="text-xs text-blue-800 space-y-1">
                {/* We show Kids as single line (Max: X) */}
                {relationOptions.length === 0 ? (
                  <div className="text-rose-600">No relations are available to add. Please contact your administrator.</div>
                ) : (
                  <>
                    {/* Build a "Who can add" list that groups SON/DAUGHTER under KIDS */}
                    {/* Gather counts */}
                    {(() => {
                      // Build a helper map for display
                      const display = [];
                      // Self
                      const selfOpt = relationOptions.find(r => r.value === "SELF");
                      if (familyDefNormalized.self?.enabled && selfOpt) display.push({ key: "SELF", label: "Self", max: selfOpt.maxCount, count: dependents.filter(d => d.relation === "SELF").length, icon: FamilyIcons.SELF });

                      // Spouse
                      const sp = relationOptions.find(r => r.value === "SPOUSE");
                      if (sp) display.push({ key: "SPOUSE", label: "Spouse", max: sp.maxCount, count: dependents.filter(d => d.relation === "SPOUSE").length, icon: FamilyIcons.SPOUSE });

                      // Kids aggregated
                      const kidsLimit = familyDefNormalized.kids.no || familyDefNormalized.kids_no || 0;
                      const kidsCount = dependents.filter(d => d.relation === "SON" || d.relation === "DAUGHTER").length;
                      if ((familyDefNormalized.kids?.enabled) || kidsLimit > 0) display.push({ key: "KIDS", label: "Kids", max: kidsLimit, count: kidsCount, icon: FamilyIcons.SON });

                      // Parents
                      const parentEnabled = familyDefNormalized.parent?.enabled;
                      if (parentEnabled) {
                        display.push({ key: "PARENTS", label: "Parents", max: (familyDefNormalized.parent.no || familyDefNormalized.parent_no || 0), count: dependents.filter(d => d.relation === "FATHER" || d.relation === "MOTHER").length, icon: FamilyIcons.FATHER });
                      }

                      // Parent in law
                      const pilEnabled = familyDefNormalized.parent_in_law?.enabled;
                      if (pilEnabled) {
                        display.push({ key: "PARENTS_IN_LAW", label: "Parent-in-law", max: (familyDefNormalized.parent_in_law.no || familyDefNormalized.parent_in_law_no || 0), count: dependents.filter(d => d.relation === "FATHER_IN_LAW" || d.relation === "MOTHER_IN_LAW").length, icon: FamilyIcons.FATHER_IN_LAW });
                      }

                      // Siblings
                      const siblingEnabled = familyDefNormalized.sibling?.enabled;
                      if (siblingEnabled) {
                        display.push({ key: "SIBLING", label: "Siblings", max: (familyDefNormalized.sibling.no || familyDefNormalized.sibling_no || 0), count: dependents.filter(d => d.relation === "SIBLING").length, icon: FamilyIcons.SIBLING || FamilyIcons.OTHERS });
                      }

                      // Partners
                      const partnersEnabled = familyDefNormalized.partners?.enabled;
                      if (partnersEnabled) {
                        display.push({ key: "PARTNERS", label: "Partners", max: (familyDefNormalized.partners.no || familyDefNormalized.partners_no || 0), count: dependents.filter(d => d.relation === "PARTNERS").length, icon: FamilyIcons.PARTNERS || FamilyIcons.OTHERS });
                      }

                      // Others (aggregated)
                      const othersEnabled = familyDefNormalized.others?.enabled;
                      if (othersEnabled) {
                        const otherTypes = ["OTHERS", "BROTHER", "SISTER", "NEPHEW", "NIECE", "UNCLE", "AUNT", "COUSIN", "GRANDPARENT", "GRANDCHILD", "OTHER_RELATIVE"];
                        const othersCount = otherTypes.reduce((sum, type) => sum + dependents.filter(d => d.relation === type).length, 0);
                        display.push({ key: "OTHERS_GROUP", label: "Other Relatives", max: (familyDefNormalized.others.no || familyDefNormalized.others_no || 0), count: othersCount, icon: FamilyIcons.OTHERS });
                      }

                      return display.map(item => (
                        <div key={item.key} className="flex items-center gap-2">
                          <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" />
                          <span>{item.label}{item.max !== undefined ? ` (Max: ${item.max})` : ""}</span>
                          <span className="text-xs text-gray-500"> — {item.count} added</span>
                          {item.max && item.count >= item.max && <span className="ml-2 text-xs text-rose-600">(limit reached)</span>}
                        </div>
                      ));
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.insured_name} onChange={(e) => updateFormData("insured_name", e.target.value)} disabled={isSelfEdit} className={`block w-full px-4 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors ${errors.insured_name ? "border-red-300 bg-red-50" : "border-gray-300"} ${isSelfEdit ? "bg-gray-100 cursor-not-allowed" : ""}`} placeholder="Enter full name" />
              {errors.insured_name && <p className="text-xs text-red-600 mt-1">{errors.insured_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Relationship <span className="text-red-500">*</span></label>
              <select value={formData.relation} onChange={(e) => {
                const relation = e.target.value;
                const detailed_relation = e.target.options[e.target.selectedIndex].text;
                setFormData(prev => ({ ...prev, relation, detailed_relation }));
                setErrors(prev => ({ ...prev, relation: undefined }));
              }} disabled={isSelfEdit} className={`block w-full px-4 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors ${errors.relation ? "border-red-300 bg-red-50" : "border-gray-300"} ${isSelfEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}>
                <option value="">Select relationship</option>
                {relationOptions.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled ? true : undefined}>{opt.label}{opt.disabled ? " (full)" : ""}</option>
                ))}
              </select>
              {errors.relation && <p className="text-xs text-red-600 mt-1">{errors.relation}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
              <select value={formData.gender} onChange={(e) => updateFormData("gender", e.target.value)} disabled={isSelfEdit} className={`block w-full px-4 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors ${errors.gender ? "border-red-300 bg-red-50" : "border-gray-300"} ${isSelfEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}>
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
              <input type="date" value={formData.dob} onChange={(e) => updateFormData("dob", e.target.value)} max={new Date().toISOString().split("T")[0]} className={`block w-full px-4 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors ${errors.dob ? "border-red-300 bg-red-50" : "border-gray-300"}`} />
              {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}
            </div>
          </div>

          {formData.age !== "" && formData.age !== null && (
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Age</label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#934790] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{formData.age}</span>
                </div>
                <span className="text-xs text-gray-600">years old</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">Cancel</button>
            {(() => {
              const totalKids = dependents.filter(d => d.relation === "SON" || d.relation === "DAUGHTER").length;
              const kidsLimit = familyDefNormalized.kids.no || familyDefNormalized.kids_no || 0;
              const kidsLimitReached = (formData.relation === "SON" || formData.relation === "DAUGHTER") && kidsLimit > 0 && totalKids >= kidsLimit && !isEdit;
              return (
                <>
                  <button onClick={handleSubmit} className="px-6 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#934790] to-[#7a3d7a] rounded-lg hover:from-[#7a3d7a] hover:to-[#934790] focus:outline-none focus:ring-2 focus:ring-[#934790] transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={kidsLimitReached}>{isEdit ? "Save Changes" : "Add Member"}</button>
                  {kidsLimitReached && <span className="ml-4 text-xs text-rose-600 font-semibold">You can only add up to {kidsLimit} children (son + daughter).</span>}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------
// Main Step1 Component (combined)
// -----------------------
export default function Step1AddDependents({
  employee,
  enrollmentDetail,
  familyDefinition,
  formData,
  updateFormData,
  onNext,
}) {
  // local state
  const [dependents, setDependents] = useState(() => {
    // initial from formData only
    if (formData && Array.isArray(formData.dependents) && formData.dependents.length) return formData.dependents;
    return [];
  });
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editInitialData, setEditInitialData] = useState(null);

  // Parse + normalize familyDefinition
  const familyDefNormalized = normalizeFamilyDefinition(familyDefinition || {});

  // Relationship options (we keep SON/DAUGHTER as dropdown, but aggregate in display)
  const relationshipTypes = [];
  if (familyDefNormalized.self?.enabled !== false) relationshipTypes.push({ value: "SELF", label: "Self", maxCount: familyDefNormalized.self.no || 1 });
  if (familyDefNormalized.spouse?.enabled) relationshipTypes.push({ value: "SPOUSE", label: "Spouse", maxCount: familyDefNormalized.spouse.no || 1 });

  // For kids: show SON and DAUGHTER in dropdown but aggregated in the who-can-add panel.
  if (familyDefNormalized.kids?.enabled) {
    const maxKids = (familyDefNormalized.kids.no !== undefined && familyDefNormalized.kids.no !== null) ? familyDefNormalized.kids.no : (familyDefNormalized.kids_no || 0);
    relationshipTypes.push({ value: "SON", label: "Son", maxCount: maxKids });
    relationshipTypes.push({ value: "DAUGHTER", label: "Daughter", maxCount: maxKids });
  }

  if (familyDefNormalized.parent?.enabled) {
    relationshipTypes.push({ value: "FATHER", label: "Father", maxCount: 1 });
    relationshipTypes.push({ value: "MOTHER", label: "Mother", maxCount: 1 });
  }
  if (familyDefNormalized.parent_in_law?.enabled) {
    relationshipTypes.push({ value: "FATHER_IN_LAW", label: "Father-in-law", maxCount: 1 });
    relationshipTypes.push({ value: "MOTHER_IN_LAW", label: "Mother-in-law", maxCount: 1 });
  }
  if (familyDefNormalized.sibling?.enabled) relationshipTypes.push({ value: "SIBLING", label: "Sibling", maxCount: familyDefNormalized.sibling.no || 0 });
  if (familyDefNormalized.partners?.enabled) relationshipTypes.push({ value: "PARTNERS", label: "Partners", maxCount: familyDefNormalized.partners.no || 0 });
  if (familyDefNormalized.others?.enabled) relationshipTypes.push({ value: "OTHERS", label: "Others", maxCount: familyDefNormalized.others.no || 0 });

  const relationOptions = relationshipTypes.filter(opt => opt.value !== "SELF");

  // persist dependents changes to localStorage + updateFormData
  // Update parent formData whenever dependents change
  useEffect(() => {
    // Only send the changed dependents to parent to avoid overwriting other keys (selectedPlans, premiumCalculations)
    if (typeof updateFormData === "function") updateFormData({ dependents });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependents]);

  // Ensure SELF present exactly once if allowed
  useEffect(() => {
    if (familyDefNormalized.self?.enabled) {
      const hasSelf = dependents.some(d => d.relation === "SELF");
      if (!hasSelf) {
        const selfDependent = {
          id: "self",
          insured_name: employee.full_name || "",
          relation: "SELF",
          detailed_relation: "Self",
          gender: employee.gender ? String(employee.gender).toUpperCase() : "",
          dob: employee.date_of_birth || employee.dob || "",
          age: employee.age || (employee.date_of_birth ? calculateAgeFromDOB(employee.date_of_birth) : ""),
          is_self: true,
        };
        setDependents(prev => [selfDependent, ...prev]);
        // updateFormData will be called via effect
      }
    } else {
      // If self is not allowed but exists in dependents, remove it
      if (dependents.some(d => d.relation === "SELF")) {
        setDependents(prev => prev.filter(d => d.relation !== "SELF"));
      }
    }
    // run only on mount / familyDefNormalized change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyDefNormalized._raw, employee?.id]);

  // helpers
  const getRelationshipCount = (relation) => dependents.filter(dep => dep.relation === relation).length;
  const totalKids = getRelationshipCount("SON") + getRelationshipCount("DAUGHTER");
  const availableRelationsForAdd = relationOptions.filter(opt => {
    if ((opt.value === "SON" || opt.value === "DAUGHTER") && (familyDefNormalized.kids.no || familyDefNormalized.kids_no)) {
      const kidsLimit = familyDefNormalized.kids.no || familyDefNormalized.kids_no || 0;
      return kidsLimit > 0 ? (totalKids < kidsLimit) : (getRelationshipCount(opt.value) < opt.maxCount);
    }
    return getRelationshipCount(opt.value) < opt.maxCount;
  });

  function checkParentCombination(candidate, currentDependents, fam = familyDefNormalized, editingId = null) {
    const rule = fam.add_both_parent_n_parent_in_law || "both";
    if (rule === "both") return null;
    const would = currentDependents.filter(d => (editingId ? d.id !== editingId : true)).map(d => d.relation);
    if (candidate && candidate.relation) would.push(candidate.relation);
    const parentCount = would.filter(r => r === "FATHER" || r === "MOTHER").length;
    const inLawCount = would.filter(r => r === "FATHER_IN_LAW" || r === "MOTHER_IN_LAW").length;
    if (rule === "either" && parentCount > 0 && inLawCount > 0) return "Policy allows either parent or parent-in-law, not both.";
    if (rule === "cross_combination" && parentCount + inLawCount > 2) return "Policy allows maximum 2 combined parents / parents-in-law.";
    return null;
  }

  // Save/Add dependent (called by modal)
  const handleSaveDependent = (payload) => {
    // cleanup
    const cleanPayload = { ...payload };
    delete cleanPayload.unique_id;
    delete cleanPayload.rank;

    // ensure age is present
    if (!cleanPayload.age && cleanPayload.dob) cleanPayload.age = calculateAgeFromDOB(cleanPayload.dob);

    setDependents(prev => {
      // prevent duplicate SELF
      if (cleanPayload.relation === "SELF") {
        // replace any existing SELF
        const others = prev.filter(p => p.relation !== "SELF");
        return [{ ...cleanPayload, is_self: true }, ...others];
      }
      // update existing or append
      const exists = prev.find(d => d.id === cleanPayload.id);
      let updated;
      if (exists) {
        updated = prev.map(d => d.id === cleanPayload.id ? { ...cleanPayload } : d);
      } else {
        updated = [...prev, cleanPayload];
      }
      // always put SELF first if exists
      const self = updated.find(d => d.relation === "SELF");
      const others = updated.filter(d => d.relation !== "SELF");
      return self ? [self, ...others] : others;
    });
    setErrors({});
  };

  const removeDependent = (id) => {
    setDependents(prev => {
      const self = prev.find(p => p.relation === "SELF");
      const others = prev.filter(p => p.relation !== "SELF" && p.id !== id);
      return self ? [self, ...others] : others;
    });
    showToast("Dependent removed successfully");
  };

  const openAddModal = () => {
    setEditInitialData(null);
    setShowAddModal(true);
  };
  const openEditModal = (dep) => {
    setEditInitialData(dep);
    setShowAddModal(true);
  };

  // Validate all dependents before Next
  const validateDependents = () => {
    const errs = {};
    const normalized = familyDefNormalized;

    // counts
    const countByType = {};
    dependents.forEach(dep => {
      countByType[dep.relation] = (countByType[dep.relation] || 0) + 1;
    });

    // parent/in-law check
    const parentList = dependents.filter(d => d.relation === "FATHER" || d.relation === "MOTHER");
    const parentInLawList = dependents.filter(d => d.relation === "FATHER_IN_LAW" || d.relation === "MOTHER_IN_LAW");
    const comboRule = normalized.add_both_parent_n_parent_in_law || "both";
    if (comboRule === "either") {
      if (parentList.length > 0 && parentInLawList.length > 0) errs.parent_combination = "* You cannot add both Parent and Parent-In-Law";
    } else if (comboRule === "cross_combination") {
      if (parentList.length + parentInLawList.length > 2) errs.parent_combination = "* You cannot add more than 2 Parent/Parents-in-Law";
    }

    // spouse same gender
    if (normalized.spouse_with_same_gender !== "allowed") {
      const selfDep = dependents.find(d => d.relation === "SELF");
      const spouseDep = dependents.find(d => d.relation === "SPOUSE");
      if (selfDep && spouseDep && selfDep.gender && spouseDep.gender && String(selfDep.gender).toUpperCase() === String(spouseDep.gender).toUpperCase()) {
        errs.spouse = "* Spouse Cannot be same Gender";
      }
    }

    // per-type max validation (respect kids aggregated)
    Object.keys(countByType).forEach(type => {
      const allowedNo = (function () {
        if (type === "SON" || type === "DAUGHTER") return normalized.kids?.no ?? normalized.kids_no ?? 0;
        if (type === "SPOUSE") return normalized.spouse?.no ?? normalized.spouse_no ?? 0;
        if (type === "SELF") return normalized.self?.no ?? normalized.self_no ?? 1;
        if (type === "FATHER" || type === "MOTHER") return normalized.parent?.no ?? normalized.parent_no ?? 0;
        if (type === "FATHER_IN_LAW" || type === "MOTHER_IN_LAW") return normalized.parent_in_law?.no ?? normalized.parent_in_law_no ?? 0;
        if (type === "SIBLING") return normalized.sibling?.no ?? normalized.sibling_no ?? 0;
        if (type === "PARTNERS") return normalized.partners?.no ?? normalized.partners_no ?? 0;

        // Handle all "others" relationship types under the same limit
        const otherTypes = ["OTHERS", "BROTHER", "SISTER", "NEPHEW", "NIECE", "UNCLE", "AUNT", "COUSIN", "GRANDPARENT", "GRANDCHILD", "OTHER_RELATIVE"];
        if (otherTypes.includes(type)) {
          return normalized.others?.no ?? normalized.others_no ?? 0;
        }

        return (normalized[type.toLowerCase()] && normalized[type.toLowerCase()].no) || 0;
      })();
      if (allowedNo && countByType[type] > allowedNo) {
        errs[type] = `* You cannot add more than ${allowedNo} ${type.replace("_", " ").toUpperCase()}`;
      }
    });

    // Aggregate validation for "others" category
    const otherTypes = ["OTHERS", "BROTHER", "SISTER", "NEPHEW", "NIECE", "UNCLE", "AUNT", "COUSIN", "GRANDPARENT", "GRANDCHILD", "OTHER_RELATIVE"];
    const totalOthers = otherTypes.reduce((sum, type) => sum + (countByType[type] || 0), 0);
    const othersLimit = normalized.others?.no ?? normalized.others_no ?? 0;
    if (othersLimit && totalOthers > othersLimit) {
      errs.others_total = `* You cannot add more than ${othersLimit} other relatives in total`;
    }

    // kids aggregated check: SON + DAUGHTER <= kids_no
    const kidsLimit = normalized.kids?.no ?? normalized.kids_no ?? 0;
    const sons = dependents.filter(d => d.relation === "SON").length;
    const daughters = dependents.filter(d => d.relation === "DAUGHTER").length;
    if (kidsLimit && (sons + daughters) > kidsLimit) {
      errs.kids = `* You cannot add more than ${kidsLimit} children (son + daughter)`;
    }

    // age validation per dependent
    dependents.forEach((dep, idx) => {
      const k = (dep.relation || "").toLowerCase();
      let relConf = {};
      let age = dep.age;
      if (k === "self") {
        // Always use employee's age or DOB for self
        if (employee && employee.age) {
          age = employee.age;
        } else if (employee && (employee.date_of_birth || employee.dob)) {
          age = calculateAgeFromDOB(employee.date_of_birth || employee.dob);
        }
        relConf = { min_age: normalized.self?.min_age ?? normalized.self_min_age, max_age: normalized.self?.max_age ?? normalized.self_max_age };
      } else if (k === "son" || k === "daughter" || k === "kid") {
        relConf = { min_age: normalized.kids?.min_age ?? normalized.kids_min_age, max_age: normalized.kids?.max_age ?? normalized.kids_max_age };
      } else if (k === "father" || k === "mother") {
        relConf = { min_age: normalized.parent?.min_age ?? normalized.parent_min_age, max_age: normalized.parent?.max_age ?? normalized.parent_max_age };
      } else if (k === "father_in_law" || k === "mother_in_law") {
        relConf = { min_age: normalized.parent_in_law?.min_age ?? normalized.parent_in_law_min_age, max_age: normalized.parent_in_law?.max_age ?? normalized.parent_in_law_max_age };
      } else if (k === "spouse") {
        relConf = { min_age: normalized.spouse?.min_age ?? normalized.spouse_min_age, max_age: normalized.spouse?.max_age ?? normalized.spouse_max_age };
      } else if (k === "sibling") {
        relConf = { min_age: normalized.sibling?.min_age ?? normalized.sibling_min_age, max_age: normalized.sibling?.max_age ?? normalized.sibling_max_age };
      } else if (k === "partners") {
        relConf = { min_age: normalized.partners?.min_age ?? normalized.partners_min_age, max_age: normalized.partners?.max_age ?? normalized.partners_max_age };
      } else if (["others", "brother", "sister", "nephew", "niece", "uncle", "aunt", "cousin", "grandparent", "grandchild", "other_relative"].includes(k)) {
        // All "others" types use the same age configuration
        relConf = { min_age: normalized.others?.min_age ?? normalized.others_min_age, max_age: normalized.others?.max_age ?? normalized.others_max_age };
      }
      if (relConf.min_age != null && age != null && age < relConf.min_age) {
        errs[`${dep.relation}_${idx}_age`] = `* ${dep.insured_name || dep.relation}'s age should be at least ${relConf.min_age}`;
      }
      if (relConf.max_age != null && age != null && age > relConf.max_age) {
        errs[`${dep.relation}_${idx}_age`] = `* ${dep.insured_name || dep.relation}'s age should be at most ${relConf.max_age}`;
      }
    });

    // not covered in policy
    dependents.forEach((dep, idx) => {
      const k = (dep.relation || "").toLowerCase();
      let relConf = {};

      // Map relationship to config
      if (k === "self") relConf = normalized.self || {};
      else if (k === "spouse") relConf = normalized.spouse || {};
      else if (k === "son" || k === "daughter") relConf = normalized.kids || {};
      else if (k === "father" || k === "mother") relConf = normalized.parent || {};
      else if (k === "father_in_law" || k === "mother_in_law") relConf = normalized.parent_in_law || {};
      else if (k === "sibling") relConf = normalized.sibling || {};
      else if (k === "partners") relConf = normalized.partners || {};
      else if (["others", "brother", "sister", "nephew", "niece", "uncle", "aunt", "cousin", "grandparent", "grandchild", "other_relative"].includes(k)) {
        relConf = normalized.others || {};
      }

      if (relConf.enabled === false) {
        errs[`${dep.relation}_${idx}_not_covered`] = `* ${dep.relation} Not Covered In this Policy`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateFormAndProceed = () => {
    if (validateDependents()) {
      // proceed to step 2
      if (typeof onNext === "function") {
        onNext();
      } else {
        router.visit("/enrollment/step2");
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // displayDependents: place SELF first if present
  let displayDependents = dependents;
  if (dependents.some(d => d.relation === "SELF")) {
    const selfMember = dependents.find(d => d.relation === "SELF");
    const others = dependents.filter(d => d.relation !== "SELF");
    displayDependents = [selfMember, ...others];
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Family Members</h3>
      </div>

      {/* Employee Card */}
      <div className="bg-gradient-to-r from-[#faf5ff] via-white to-[#faf5ff] border border-purple-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#934790] to-[#7a3d7a] rounded-xl flex items-center justify-center">
            <img src={FamilyIcons.SELF} alt="Self" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#4b1864]">Primary Insured (Employee)</h4>
            <p className="text-sm text-gray-600">This is the main policy holder</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
            <p className="text-sm font-medium text-gray-900">{employee.full_name}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Employee Code</label>
            <p className="text-sm font-medium text-gray-900">{employee.employees_code}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
            <p className="text-sm font-medium text-gray-900">{employee.gender || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Dependents Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-gray-900">Dependents ({dependents.length})</h4>
            <p className="text-sm text-gray-600 mt-1">Family members covered under this policy</p>
          </div>

          <button type="button" onClick={availableRelationsForAdd.length > 0 ? openAddModal : undefined} className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl focus:outline-none focus:ring-4 transition-all shadow-lg ${availableRelationsForAdd.length > 0 ? "bg-gradient-to-r from-[#934790] to-[#7a3d7a] text-white hover:from-[#7a3d7a] hover:to-[#934790]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} disabled={availableRelationsForAdd.length === 0} title={availableRelationsForAdd.length === 0 ? "All relationship limits reached. You cannot add more members." : ""}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add Family Member
          </button>
        </div>

        {/* Dependents grid */}
        {displayDependents.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No family members added yet</h3>
            <p className="text-gray-500 mb-6">Add family members to include them in your insurance coverage</p>
            <button onClick={openAddModal} className="inline-flex items-center px-6 py-3 font-semibold rounded-xl focus:outline-none focus:ring-4 transition-all shadow-lg bg-gradient-to-r from-[#934790] to-[#7a3d7a] text-white hover:from-[#7a3d7a] hover:to-[#934790]">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add Your First Family Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDependents.map((dependent) => (
              <div key={dependent.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#934790]/10 to-[#7a3d7a]/10 rounded-lg flex items-center justify-center">
                      <img src={FamilyIcons[dependent.relation] || FamilyIcons.SELF} alt={dependent.detailed_relation || "Member"} className="w-8 h-8 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 truncate">{dependent.detailed_relation || "Member"}</h5>
                      <p className="text-sm text-gray-500 truncate">{dependent.insured_name || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => openEditModal(dependent)} className="text-gray-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors" title="Edit dependent"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                    {dependent.relation !== "SELF" && (<button type="button" onClick={() => removeDependent(dependent.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Remove dependent"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">Gender</span><span className="text-sm font-medium text-gray-900">{dependent.gender || "Not specified"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">Date of Birth</span><span className="text-sm font-medium text-gray-900">{dependent.dob ? (() => { const d = new Date(dependent.dob); return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`; })() : "Not specified"}</span></div>
                  {dependent.age && (<div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">Age</span><div className="flex items-center gap-2"><span className="text-sm font-bold text-[#934790]">{dependent.age}</span><span className="text-xs text-gray-500">years</span></div></div>)}
                </div>

                {dependent.is_self && (<div className="mt-4 pt-3 border-t border-gray-100"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#934790]/10 text-[#934790]"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Primary Insured</span></div>)}
              </div>
            ))}
          </div>
        )}

        {availableRelationsForAdd.length === 0 && dependents.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-600 mt-0.5"><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div>
              <div>
                <h4 className="font-medium text-amber-800">All relationship limits reached</h4>
                <p className="text-sm text-amber-700 mt-1">You have reached the maximum number of family members allowed for each relationship type according to your policy configuration.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation / Errors */}
      <div className="flex flex-col pt-8 border-t border-gray-200">
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            <div className="font-semibold mb-1">Please fix the following before proceeding:</div>
            <ul className="list-disc pl-5">
              {Object.entries(errors).map(([key, msg]) => <li key={key}>{msg}</li>)}
            </ul>
          </div>
        )}

        <div className="flex justify-between">
          <div></div>
          <button type="button" onClick={validateFormAndProceed} className="inline-flex items-center px-8 py-3 font-semibold rounded-xl focus:outline-none focus:ring-4 transition-all shadow-lg bg-gradient-to-r from-[#934790] to-[#7a3d7a] text-white hover:from-[#7a3d7a] hover:to-[#934790] ">
            Next: Choose Plans
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Modal */}
      <AddDependentModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditInitialData(null); }}
        onSave={handleSaveDependent}
        relationOptions={relationOptions}
        familyDefNormalized={familyDefNormalized}
        dependents={dependents}
        initialData={editInitialData}
        employee={employee}
      />
    </div>
  );
}
