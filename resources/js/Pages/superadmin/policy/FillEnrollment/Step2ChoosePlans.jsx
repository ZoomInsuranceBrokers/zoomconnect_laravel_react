// resources/js/Pages/Enrollment/Step2ChoosePlans.jsx
import React, { useEffect, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import * as premiumCalculator from "../../../../utils/premiumCalculator";
import PremiumSummary from './PremiumSummary';
/**
 * Step2ChoosePlans.jsx
 *
 * Enhanced with robust premium calculation system supporting:
 * - simple, floater_highest_age, age_based, per_life, relation_wise
 * - Company contribution and proration
 * - Grade-wise sum insured
 * - Comprehensive validation
 *
 * Props:
 * - employee
 * - availablePlans (expected shape: { basePlans: [...], extraCoveragePlans: [...], ratingConfig: {...} } OR ratingConfig directly)
 * - formData (contains dependents, selectedPlans, premiumCalculations)
 * - updateFormData (function)
 * - onNext, onPrevious (functions)
 */


export default function Step2ChoosePlans({
  employee,
  availablePlans,
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) {
  // read dependents from formData only
  const [dependents, setDependents] = useState(formData?.dependents && formData.dependents.length ? formData.dependents : []);

  // unify rating config & basePlans
  const ratingConfig = useMemo(() => {
    if (!availablePlans) return {};
    let config = null;

    // First priority: explicit ratingConfig
    if (availablePlans.ratingConfig) config = availablePlans.ratingConfig;
    else if (availablePlans.rating_config) config = availablePlans.rating_config;
    // If availablePlans has basePlans/topupPlans, it's a wrapper object - don't use as config
    else if (availablePlans.basePlans || availablePlans.topupPlans || availablePlans.extraCoveragePlans) {
      config = null;
    }
    // Otherwise, treat availablePlans as config directly (legacy fallback)
    else config = availablePlans;

    // Parse JSON string if needed (from backend)
    if (typeof config === 'string') {
      try {
        config = JSON.parse(config);
      } catch (e) {
        console.error('Failed to parse ratingConfig JSON:', e, config);
        config = {};
      }
    }

    const result = config || {};
  // ...existing code...
    return result;
  }, [availablePlans]);

  const basePlans = useMemo(() => {
    if (!availablePlans) return [];
    return availablePlans.basePlans || ratingConfig.plans || [];
  }, [availablePlans, ratingConfig]);

  const extraCoveragePlans = useMemo(() => {
    return (availablePlans && availablePlans.extraCoveragePlans) || [];
  }, [availablePlans]);

  // selection state from formData only
  const [selection, setSelection] = useState(formData.selectedPlans || {
    selectedPlanId: null,
    extraCoverageSelected: [],
    premiumCalculations: {
      grossPremium: 0,
      extraCoveragePremium: 0,
      totalPremium: 0,
      gst: 0,
      grossPlusGst: 0,
      companyContributionAmount: 0,
      employeePayable: 0,
    },
  });

  const [errors, setErrors] = useState({});

  // Helper: format currency INR
  const formatCurrencyLocal = (amount) => {
    if (premiumCalculator.formatCurrency) {
      return premiumCalculator.formatCurrency(amount);
    }
    // Fallback formatting
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Determine base sum insured (handles grade_wise or fixed, and only if type is valid and value is present)
  function getBaseSumInsured(cfg) {
  // ...existing code...

    if (!cfg) {
  // ...existing code...
      return null;
    }

    const type = String(cfg.base_sum_insured_type || '').toLowerCase();
  // ...existing code...
  // ...existing code...

    if ((type === 'fixed' || type === 'grade_wise' || type === 'gradewise')) {
      if (type === 'grade_wise' || type === 'gradewise') {
        const grade = (employee?.grade || '').toString();
  // ...existing code...

        if (Array.isArray(cfg.grade_wise_sum_insured) && grade) {
          const found = cfg.grade_wise_sum_insured.find((g) => String(g.grade_name) === String(grade));
          if (found && found.sum_insured && !isNaN(found.sum_insured) && Number(found.sum_insured) > 0) {
            // ...existing code...
            return Number(found.sum_insured);
          }
        }
      }

      // fallback to top-level base_sum_insured if provided and not null/empty/zero
      if (cfg.base_sum_insured !== undefined && cfg.base_sum_insured !== null && String(cfg.base_sum_insured).trim() !== '' && !isNaN(cfg.base_sum_insured) && Number(cfg.base_sum_insured) > 0) {
  // ...existing code...
        return Number(cfg.base_sum_insured);
      }
    }

  // ...existing code...
    return null;
  }

  // Display base sum insured label
  const baseSI = getBaseSumInsured(ratingConfig);

  // ...existing code...
  // Add a default plan for base sum insured if baseSI exists
  const basePlanDefault = baseSI !== null && baseSI !== undefined ? {
    id: 'base_sum_insured',
    plan_name: 'Default (Base Sum Insured)',
    sum_insured: baseSI,
    premium_amount: 0,
    isDefaultBase: true
  } : null;

  // Compose plans list with default base plan if needed
  const plansWithBase = useMemo(() => {
    if (basePlanDefault) {
      return [basePlanDefault, ...basePlans];
    }
    return basePlans;
  }, [basePlanDefault, basePlans]);

  // If no plan is selected and baseSI exists, select the default base plan by default
  useEffect(() => {
    if (!selection.selectedPlanId && basePlanDefault) {
      setSelection((prev) => ({ ...prev, selectedPlanId: 'base_sum_insured' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePlanDefault]);

  // Helper: find selected plan object
  const selectedPlanObj = useMemo(() => {
    if (!selection?.selectedPlanId) return null;
    return plansWithBase.find((p) => String(p.id) === String(selection.selectedPlanId)) || null;
  }, [selection?.selectedPlanId, plansWithBase]);

  // Helper: check if only base sum insured (no plan selected)
  const isBaseSumInsuredOnly = useMemo(() => {
    return !selection?.selectedPlanId && baseSI !== null && baseSI !== undefined;
  }, [selection?.selectedPlanId, baseSI]);

  // Main: compute premiums using the new premium calculation system
  function computePremiums(cfg, sel, members) {
    cfg = cfg || {};
    sel = sel || {};
    members = members || [];

  // ...existing code...

    // If only base sum insured (no plan selected), show premium 0
    if (!sel.selectedPlanId && baseSI !== null && baseSI !== undefined) {
      // Add extra coverage premium calculation even for base sum insured
      let extraCoveragePremium = 0;
      if (Array.isArray(sel.extraCoverageSelected) && extraCoveragePlans.length) {
        sel.extraCoverageSelected.forEach((id) => {
          const ex = extraCoveragePlans.find((p) => String(p.id) === String(id));
          if (ex) {
            extraCoveragePremium += Number(ex.employee_contribution ?? ex.premium ?? ex.premium_amount ?? 0) || 0;
          }
        });
      }

      const gst = extraCoveragePremium * 0.18;
      const grossPlusGst = extraCoveragePremium + gst;

      // Apply company contribution if exists
      let finalEmployeePayable = extraCoveragePremium;
      let companyContributionAmount = 0;
      if (cfg.company_contribution && Number(cfg.company_contribution_percentage) > 0) {
        companyContributionAmount = grossPlusGst * (Number(cfg.company_contribution_percentage) / 100);
        finalEmployeePayable = grossPlusGst - companyContributionAmount;
      } else {
        finalEmployeePayable = grossPlusGst;
      }

      return {
        grossPremium: 0,
        extraCoveragePremium,
        totalPremium: extraCoveragePremium,
        gst,
        grossPlusGst,
        companyContributionAmount,
        employeePayable: Math.max(0, finalEmployeePayable),
        breakdown: [],
        calculationNote: 'Base sum insured only (no plan selected)',
        sumInsured: baseSI,
        proratedPremium: 0,
        prorationFactor: 0
      };
    }

    try {
      // Validate inputs only if using premium calculator
      if (premiumCalculator.validatePremiumInputs) {
        const validationErrors = premiumCalculator.validatePremiumInputs(employee, dependents, cfg);
        if (validationErrors && validationErrors.length > 0) {
          console.warn('⚠️ Premium calculation validation errors:', validationErrors);
        }
      }

      // Use the new premium calculation system
      let result;
      if (premiumCalculator.calculatePremium) {
  result = premiumCalculator.calculatePremium(employee, dependents, cfg, sel.selectedPlanId);
      } else {
        console.warn('⚠️ Premium calculator not available, using fallback');
        // Fallback calculation if calculator not available
        const selectedPlan = basePlans.find(p => String(p.id) === String(sel.selectedPlanId));
        const planPremium = selectedPlan ? Number(selectedPlan.premium_amount ?? selectedPlan.employee_premium ?? selectedPlan.premium ?? 0) : 0;

        // Apply per-life logic if plan type is per_life
        const finalPremium = (cfg.plan_type === 'per_life' || cfg.rator_type === 'per_life')
          ? planPremium * allMembers.length
          : planPremium;

        result = {
          total_premium: finalPremium,
          employee_payable: finalPremium,
          company_contribution_amount: 0,
          sum_insured: selectedPlan?.sum_insured ? Number(selectedPlan.sum_insured) : baseSI,
          breakdown: allMembers.map(member => ({
            ...member,
            premium: (cfg.plan_type === 'per_life' || cfg.rator_type === 'per_life') ? planPremium : finalPremium / allMembers.length,
            calculation_note: 'Fallback calculation'
          })),
          note: 'Fallback calculation'
        };
      }

      if (result && result.error) {
        console.error('❌ Premium calculation error:', result.note);
        return {
          grossPremium: 0,
          extraCoveragePremium: 0,
          totalPremium: 0,
          gst: 0,
          grossPlusGst: 0,
          companyContributionAmount: result.company_contribution_amount || 0,
          employeePayable: result.employee_payable || 0,
          breakdown: result.breakdown || [],
          calculationNote: result.note
        };
      }

      // Add extra coverage premium calculation
      let extraCoveragePremium = 0;
      if (Array.isArray(sel.extraCoverageSelected) && extraCoveragePlans.length) {
        sel.extraCoverageSelected.forEach((id) => {
          const ex = extraCoveragePlans.find((p) => String(p.id) === String(id));
          if (ex) {
            extraCoveragePremium += Number(ex.employee_contribution ?? ex.premium ?? ex.premium_amount ?? 0) || 0;
          }
        });
      }

      const basePremium = result ? (Number(result.total_premium) || 0) : 0;
      const totalWithExtra = basePremium + extraCoveragePremium;
      const gst = totalWithExtra * 0.18;
      const grossPlusGst = totalWithExtra + gst;

      // Apply company contribution to the total (including extra coverage)
      let finalEmployeePayable = (result ? (Number(result.employee_payable) || 0) : 0) + extraCoveragePremium;
      let companyContributionAmount = result ? (Number(result.company_contribution_amount) || 0) : 0;

      if (cfg.company_contribution && Number(cfg.company_contribution_percentage) > 0) {
        companyContributionAmount = grossPlusGst * (Number(cfg.company_contribution_percentage) / 100);
        finalEmployeePayable = grossPlusGst - companyContributionAmount;
      } else {
        finalEmployeePayable = grossPlusGst;
      }

      // ...existing code...

      return {
        grossPremium: basePremium,
        extraCoveragePremium,
        totalPremium: totalWithExtra,
        gst,
        grossPlusGst,
        companyContributionAmount,
        employeePayable: Math.max(0, finalEmployeePayable),
        breakdown: result ? (result.breakdown || []) : [],
        calculationNote: result ? (result.note || '') : 'Calculated',
        sumInsured: result ? (Number(result.sum_insured) || baseSI || 0) : (baseSI || 0),
        proratedPremium: result ? (Number(result.prorated_premium) || 0) : 0,
        prorationFactor: result ? (Number(result.proration_factor) || 0) : 0
      };

    } catch (error) {
      console.error('❌ Premium computation error:', error);
      return {
        grossPremium: 0,
        extraCoveragePremium: 0,
        totalPremium: 0,
        gst: 0,
        grossPlusGst: 0,
        companyContributionAmount: 0,
        employeePayable: 0,
        breakdown: [],
        calculationNote: `Error: ${error.message}`
      };
    }
  }

  // utility - calculate age from DOB (string)
  function calculateAge(dob) {
    if (!dob) return 0;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  // Build allMembers (employee + dependents excluding any duplicate SELF)
  const allMembers = useMemo(() => {
    const deps = (dependents || []).filter((d) => d.relation !== "SELF");
    const empMember = {
      id: "employee",
      name: employee?.full_name || "Employee",
      relation: "SELF",
      age: employee?.age || (employee?.dob || employee?.date_of_birth ? calculateAge(employee?.date_of_birth || employee?.dob) : 0),
      gender: employee?.gender || null,
      isEmployee: true,
    };
    return [empMember, ...deps.map((d) => ({
      id: d.id,
      name: d.insured_name || "",
      relation: d.relation,
      age: d.age || (d.dob ? calculateAge(d.dob) : 0),
      gender: d.gender,
      isEmployee: false,
    }))];
  }, [employee, dependents]);

  // Update parent formData whenever selection changes
  useEffect(() => {
    if (typeof updateFormData === "function") {
      updateFormData({
        ...formData,
        selectedPlans: selection,
        premiumCalculations: selection.premiumCalculations || {},
        ratingConfig: ratingConfig, // Add ratingConfig to formData
        availablePlans: availablePlans, // Also add availablePlans for reference
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  // If dependents from parent change, sync local dependents
  useEffect(() => {
    if (formData?.dependents && Array.isArray(formData.dependents)) {
      setDependents(formData.dependents);
    }
  }, [formData?.dependents]);

  // If parent formData.selectedPlans changes (e.g., from Step3), sync local selection
  useEffect(() => {
    const incoming = formData?.selectedPlans;
    if (!incoming) return;
    try {
      const curPlan = String(selection.selectedPlanId || '');
      const incPlan = String(incoming.selectedPlanId || '');
      const normalizeArray = (arr) => (Array.isArray(arr) ? arr.map(String).sort() : []);
      const curExtra = JSON.stringify(normalizeArray(selection.extraCoverageSelected || []));
      const incExtra = JSON.stringify(normalizeArray(incoming.extraCoverageSelected || []));
      if (curPlan !== incPlan || curExtra !== incExtra) {
        setSelection((prev) => ({ ...prev, ...incoming }));
      }
    } catch (e) {
      // if anything goes wrong, safely ignore sync
      console.warn('Failed to sync selection from parent formData:', e);
    }
  }, [formData?.selectedPlans]);

  // Recompute whenever members, selection.selectedPlanId, or extraCoverageSelected change
  useEffect(() => {
    const computed = computePremiums(ratingConfig, selection, allMembers);
    setSelection((prev) => ({ ...prev, premiumCalculations: computed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.selectedPlanId, selection.extraCoverageSelected, allMembers.length, JSON.stringify(allMembers.map(m=>m.age)), ratingConfig]);

  // handle selecting global plan
  const onSelectPlan = (planId) => {
    setSelection((prev) => {
      const next = { ...prev, selectedPlanId: planId };
      return next;
    });
    setErrors((s) => ({ ...s, plan: undefined }));
  };

  const toggleExtraCoverage = (id) => {
    setSelection((prev) => {
      const set = new Set(prev.extraCoverageSelected || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, extraCoverageSelected: Array.from(set) };
    });
  };

  // Validation rules (before Next)
  const validateForm = () => {
    const cfg = ratingConfig || {};
    const rtype = String(cfg.plan_type || cfg.rator_type || "").toLowerCase();
    const plansExist = Array.isArray(basePlans) && basePlans.length > 0;
    const baseSumInsured = getBaseSumInsured(cfg);
    const baseSumInsuredZero = !baseSumInsured || Number(baseSumInsured) === 0;

    const errs = {};

    // If plans exist and base sum insured is 0 => require plan selection
    // Also if rator type is per_life/age_based/floater and plans exist -> require selection (because premiums are defined in plans)
    const needSelection = plansExist && (rtype === "per_life" || rtype === "age_based" || rtype === "floater_highest_age" || rtype === "simple");

    if (needSelection && plansExist) {
      // If base sum insured > 0 and business allows not selecting a plan (base covers) -> allow proceed; but
      // if baseSumInsuredZero -> require selection
      if (!selection.selectedPlanId && baseSumInsuredZero) {
        errs.plan = "Please select a plan to proceed (base sum insured not provided).";
      }
    }

    // Extra validation: if rator is per_life and selected plan has premium_amount == 0 and baseSumInsuredZero -> warn/error
    if (String(ratingConfig.plan_type || ratingConfig.rator_type || "").toLowerCase() === "per_life" && selection.selectedPlanId) {
      const p = basePlans.find((pl) => String(pl.id) === String(selection.selectedPlanId));
      if (p && (Number(p.premium_amount || p.employee_premium || 0) === 0) && (!baseSumInsured || Number(baseSumInsured) === 0)) {
        // rare case where plan has zero premium
        // we won't block, just warn (but user asked to require selection so we already ensured selection)
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // ensure selection persisted & parent updated (effect already does this)
    if (typeof updateFormData === "function") {
      updateFormData({
        ...formData,
        selectedPlans: selection,
        premiumCalculations: selection.premiumCalculations,
      });
    }
    if (typeof onNext === "function") onNext();
    else router.visit(route("enrollment.extra_coverage"));
  };

  const handleBack = () => {
    if (typeof onPrevious === "function") onPrevious();
    else router.visit(route("enrollment.add_dependents"));
  };

  // UI plan card
  const PlanCard = ({ plan }) => {
    const selected = String(selection.selectedPlanId) === String(plan.id);
    const isBaseCard = plan.id === 'base_sum_insured';
    const planPremium = Number(plan.premium_amount ?? plan.employee_premium ?? plan.premium ?? 0) || 0;
    const sumInsured = plan.sum_insured ? Number(plan.sum_insured) : null;

    // helper to produce tooltip text explaining how premium is calculated for this plan
    const getCalculationText = () => {
      const ptype = String(ratingConfig.plan_type || ratingConfig.rator_type || '').toLowerCase();
      if (ptype === 'per_life') return 'Per-life: Premium is applied per insured life (premium × number of lives).';
      if (ptype === 'age_based') return 'Age-based: Premium varies by member age using configured age brackets.';
      if (ptype === 'floater_highest_age') return 'Floater (highest age): Premium is based on the highest age among insured members.';
      if (ptype === 'simple') return 'Simple: Flat premium for the selected plan.';
      return 'Premium is calculated using plan/rating configuration.';
    };

    if (isBaseCard) {
      return (
        <label className={`p-3 border-2 border-dashed rounded-md cursor-pointer flex items-start gap-3 bg-white ${selected ? "border-[#934790] shadow-md" : "border-blue-300 hover:bg-blue-50"}`}>
          <input
            type="radio"
            name="global_plan"
            value={plan.id}
            checked={selected}
            onChange={() => onSelectPlan(plan.id)}
            className="mt-1 mr-3 text-[#934790] focus:ring-[#934790]"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-blue-900">Base Sum Insured</p>
              <p className="text-sm font-semibold text-green-600">₹0</p>
            </div>
            <p className="text-xs text-blue-700 mt-1">Sum Insured: {formatCurrencyLocal(sumInsured)}</p>
            <p className="text-xs text-gray-500 mt-1">Default company-provided coverage</p>
          </div>
        </label>
      );
    }
    return (
      <label className={`p-3 border rounded-md cursor-pointer flex items-start gap-3 ${selected ? "border-[#934790] shadow-md bg-white" : "border-gray-200 hover:bg-gray-50"}`}>
        <input
          type="radio"
          name="global_plan"
          value={plan.id}
          checked={selected}
          onChange={() => onSelectPlan(plan.id)}
          className="mt-1 mr-3 text-[#934790] focus:ring-[#934790]"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {plan.plan_name || "Plan"}
              <span title={getCalculationText()} className="ml-2 inline-block text-xs text-gray-500 border rounded-full w-5 h-5 text-center leading-5 cursor-help">i</span>
            </p>
            <p className="text-sm font-semibold text-green-600">{formatCurrencyLocal(planPremium)}</p>
          </div>
          <p className="text-xs text-gray-600 mt-1">Sum Insured: {sumInsured ? formatCurrencyLocal(sumInsured) : "Auto / base"}</p>
          {plan.age_brackets && plan.age_brackets.length > 0 && <p className="text-xs text-gray-500 mt-1">Age-based rates available</p>}
        </div>
      </label>
    );
  };

  // compute current breakdown to show in UI (calc)
  const calc = selection.premiumCalculations || computePremiums(ratingConfig, selection, allMembers);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Choose Insurance Plans</h3>
        <p className="mt-1 text-sm text-gray-600">Select insurance plan (global selection). You will see Sum Insured, Premium and Total payable including 18% GST and company contribution.</p>
      </div>

      {/* Premium Summary component (shared) */}
      <PremiumSummary calc={calc} ratingConfig={ratingConfig} selectedPlanObj={selectedPlanObj} baseSI={baseSI} />

      {/* Plans list */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Available Plans</h4>

        {plansWithBase && plansWithBase.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plansWithBase.map((p) => <PlanCard key={p.id || p.plan_name} plan={p} />)}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">No plans available — default base sum insured (if any) will be used.</div>
        )}
      </div>

      {/* Extra coverage */}
      {extraCoveragePlans && extraCoveragePlans.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Extra Coverage (optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {extraCoveragePlans.map((ec) => (
              <label key={ec.id} className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" checked={(selection.extraCoverageSelected || []).map(String).includes(String(ec.id))} onChange={() => toggleExtraCoverage(ec.id)} className="mr-2" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{ec.plan_name}</span>
                    <span className="text-sm font-semibold">{formatCurrencyLocal(Number(ec.employee_contribution ?? ec.premium ?? ec.premium_amount ?? 0))}</span>
                  </div>
                  <div className="text-xs text-gray-500">{ec.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Validation errors */}
      {errors.plan && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600">{errors.plan}</div>}

      {/* Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={handleBack} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#934790] hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
          >
            Next: Extra Coverage
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
