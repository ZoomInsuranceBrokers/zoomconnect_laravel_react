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
  enrollmentDetail,
  availablePlans,
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) {
  // Note: debug logging referencing `selection` is placed later,
  // after `selection` is declared to avoid TDZ (temporal dead zone) errors.
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
    let plans = availablePlans.basePlans || ratingConfig.plans || [];
    
    // Handle relation_wise: extract all sum insured options from all relations
    if (ratingConfig.plan_type === 'relation_wise' && ratingConfig.relation_wise_config) {
      const relationWisePlans = [];
      const seenSumInsured = new Set();
      
      Object.entries(ratingConfig.relation_wise_config).forEach(([relation, config]) => {
        if (config.sum_insured_options && Array.isArray(config.sum_insured_options)) {
          config.sum_insured_options.forEach(option => {
            if (option.sum_insured && !seenSumInsured.has(option.sum_insured)) {
              seenSumInsured.add(option.sum_insured);
              relationWisePlans.push({
                id: option.id,
                plan_name: `Plan ₹${Number(option.sum_insured).toLocaleString('en-IN')}`,
                sum_insured: option.sum_insured,
                premium_amount: option.premium_amount,
                age_brackets: option.age_brackets || [],
                relation_wise_option: true
              });
            }
          });
        }
      });
      
      plans = relationWisePlans;
    }
    
    // Generate unique IDs for plans that don't have valid unique IDs
    // Backend sometimes sends id: 0 for all plans, so we treat 0 as invalid
    return plans.map((plan, index) => ({
      ...plan,
      id: (plan.id !== null && plan.id !== undefined && plan.id !== 0) ? String(plan.id) : `frontend_plan_${index}`
    }));
  }, [availablePlans, ratingConfig]);

  const extraCoveragePlans = useMemo(() => {
    return (availablePlans && availablePlans.extraCoveragePlans) || [];
  }, [availablePlans]);

  // selection state from formData only — normalize incoming to ensure keys and string IDs
  const defaultPremiumCalc = {
    grossPremium: 0,
    extraCoveragePremium: 0,
    totalPremium: 0,
    gst: 0,
    grossPlusGst: 0,
    companyContributionAmount: 0,
    employeePayable: 0,
  };

  const [selection, setSelection] = useState({
    selectedPlanId: null,
    extraCoverageSelected: [],
    premiumCalculations: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('📊 Step2ChoosePlans - employee:', employee);
      // eslint-disable-next-line no-console
      console.log('📊 Step2ChoosePlans - enrollmentDetail:', enrollmentDetail);
      // eslint-disable-next-line no-console
      console.log('📊 Step2ChoosePlans - selection.premiumCalculations:', selection?.premiumCalculations);
      
      // Calculate and log proration info
      if (employee?.date_of_joining && enrollmentDetail?.policy_start_date) {
        const prorationInfo = calculateProrationFactor(employee, enrollmentDetail);
        // eslint-disable-next-line no-console
        console.log('📊 Proration Info:', {
          joiningDate: employee.date_of_joining,
          policyStartDate: enrollmentDetail.policy_start_date,
          policyEndDate: enrollmentDetail.policy_end_date,
          prorationFactor: prorationInfo.prorationFactor,
          remainingDays: prorationInfo.remainingDays,
          totalPolicyDays: prorationInfo.totalPolicyDays,
          shouldProrate: prorationInfo.prorationFactor < 1
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in Step2 debug logging:', e);
    }
  }, [employee, enrollmentDetail, selection?.premiumCalculations]);

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
      // Do not call external calculator when no plan is selected — guard as required
      if (!sel.selectedPlanId) {
        // No selected plan -> return zero premiums (unless baseSI handled above)
        return {
          grossPremium: 0,
          extraCoveragePremium: 0,
          totalPremium: 0,
          gst: 0,
          grossPlusGst: 0,
          companyContributionAmount: 0,
          employeePayable: 0,
          breakdown: [],
          calculationNote: 'No plan selected',
          sumInsured: baseSI,
          proratedPremium: 0,
          prorationFactor: 0
        };
      }

      if (premiumCalculator.calculatePremium) {
        // Inject policy dates into config for pro-rata calculation
        // Inject policy dates and ensure the calculator receives the plans with generated IDs
        const cfgWithDates = {
          ...cfg,
          policy_start_date: enrollmentDetail?.policy_start_date,
          policy_end_date: enrollmentDetail?.policy_end_date,
          // pass full plans list (including generated ids) so calculator can match by id
          plans: plansWithBase || []
        };
        console.log('🧮 Calling premiumCalculator.calculatePremium with:', {
          employee_doj: employee?.date_of_joining,
          policy_start: enrollmentDetail?.policy_start_date,
          policy_end: enrollmentDetail?.policy_end_date,
          selectedPlanId: sel.selectedPlanId
        });
        result = premiumCalculator.calculatePremium(employee, dependents, cfgWithDates, sel.selectedPlanId);
        console.log('🧮 premiumCalculator.calculatePremium result:', {
          selectedPlanId: sel.selectedPlanId,
          total_premium: result?.total_premium,
          prorated_premium: result?.prorated_premium,
          proration_factor: result?.proration_factor,
          remaining_days: result?.remaining_days,
          total_policy_days: result?.total_policy_days,
          hasError: result?.error,
          note: result?.note
        });

        if (sel.selectedPlanId !== 'base_sum_insured' && (!result || Number(result.prorated_premium) === 0 || Number(result.total_premium) === 0)) {
          console.warn('⚠️ Premium calculator returned 0 or invalid, using fallback for plan:', {
            selectedPlanId: sel.selectedPlanId,
            result: result
          });
          result = null;
        } else if (result && !result.error) {
          console.log('✅ Using premium calculator result (not fallback)');
        }
      }

      if (!result) {
        if (!sel.selectedPlanId) {
          return {
            grossPremium: 0,
            extraCoveragePremium: 0,
            totalPremium: 0,
            gst: 0,
            grossPlusGst: 0,
            companyContributionAmount: 0,
            employeePayable: 0,
            breakdown: [],
            calculationNote: 'No plan selected'
          };
        }

        const selectedPlan = plansWithBase.find(p => String(p.id) === String(sel.selectedPlanId));
        
        if (!selectedPlan) {
          return {
            grossPremium: 0,
            extraCoveragePremium: 0,
            totalPremium: 0,
            gst: 0,
            grossPlusGst: 0,
            companyContributionAmount: 0,
            employeePayable: 0,
            breakdown: [],
            calculationNote: 'Selected plan not found'
          };
        }
        
        const planType = String(cfg.plan_type || cfg.rator_type || '').toLowerCase();
        const memberCount = members.length || 0;
        let finalPremium = 0;
        let premiumPerLife = 0;
        
        if (planType === 'per_life') {
          premiumPerLife = Number(selectedPlan.premium_amount || 0);
          finalPremium = premiumPerLife * memberCount;
        } else if (planType === 'floater_highest_age') {
          const highestAge = memberCount ? Math.max(...members.map(m => m.age || 0)) : 0;
          const ageBrackets = selectedPlan?.age_brackets || [];
          
          // Sort brackets by min_age descending to prioritize higher age ranges in case of overlap
          const sortedBrackets = [...ageBrackets].sort((a, b) => Number(b.min_age || 0) - Number(a.min_age || 0));
          
          // eslint-disable-next-line no-console
          console.log('🔍 Floater Highest Age:', {
            members: members.map(m => ({ name: m.name, age: m.age })),
            highestAge,
            brackets: sortedBrackets.map(br => ({ 
              min: br.min_age, 
              max: br.max_age, 
              premium: br.premium_amount 
            }))
          });
          
          const matching = sortedBrackets.find(br => {
            const minAge = Number(br.min_age || 0);
            const maxAge = Number(br.max_age || 999);
            const matches = highestAge >= minAge && highestAge <= maxAge;
            return matches;
          });
          
          finalPremium = matching ? Number(matching.premium_amount || 0) : 0;
          
          // eslint-disable-next-line no-console
          console.log('✅ Floater match result:', {
            highestAge,
            matchedBracket: matching ? {
              min: matching.min_age,
              max: matching.max_age,
              premium: matching.premium_amount
            } : 'No match',
            finalPremium
          });
        } else if (planType === 'age_based') {
          finalPremium = 0;
          const ageBrackets = selectedPlan?.age_brackets || [];
          members.forEach(member => {
            const matching = ageBrackets.find(br => {
              const minAge = Number(br.min_age || 0);
              const maxAge = Number(br.max_age || 999);
              return member.age >= minAge && member.age <= maxAge;
            });
            if (matching) {
              finalPremium += Number(matching.premium_amount || 0);
            }
          });
        } else if (planType === 'relation_wise') {
          // For relation_wise: calculate premium for each relation based on selected sum insured
          finalPremium = 0;
          const selectedSumInsured = Number(selectedPlan.sum_insured || 0);
          
          // eslint-disable-next-line no-console
          console.log('🔍 Relation Wise DETAILED calculation:', {
            selectedPlanId: sel.selectedPlanId,
            selectedPlanObject: selectedPlan,
            selectedSumInsured,
            selectedSumInsuredType: typeof selectedPlan.sum_insured,
            members: members.map(m => ({ name: m.name, relation: m.relation })),
            relation_wise_config: cfg.relation_wise_config
          });
          
          members.forEach(member => {
            const relation = String(member.relation || 'self').toLowerCase();
            const relationConfig = cfg.relation_wise_config?.[relation];
            
            // eslint-disable-next-line no-console
            console.log('👤 Processing member:', {
              memberName: member.name,
              memberRelation: member.relation,
              relationLowercase: relation,
              relationConfigExists: !!relationConfig,
              availableOptions: relationConfig?.sum_insured_options?.map(opt => ({
                id: opt.id,
                sum_insured: opt.sum_insured,
                sum_insured_type: typeof opt.sum_insured,
                sum_insured_number: Number(opt.sum_insured),
                premium_amount: opt.premium_amount
              }))
            });
            
            if (relationConfig?.sum_insured_options) {
              const matchingOption = relationConfig.sum_insured_options.find(opt => {
                const optSumInsured = Number(opt.sum_insured || 0);
                const matches = optSumInsured === selectedSumInsured;
                
                // eslint-disable-next-line no-console
                console.log('🔎 Checking option match:', {
                  optionSumInsured: opt.sum_insured,
                  optionSumInsuredNumber: optSumInsured,
                  selectedSumInsured,
                  matches
                });
                
                return matches;
              });
              
              if (matchingOption) {
                const memberPremium = Number(matchingOption.premium_amount || 0);
                finalPremium += memberPremium;
                
                // eslint-disable-next-line no-console
                console.log('✅ MATCHED - Adding premium:', {
                  member: member.name,
                  relation,
                  matchedOption: matchingOption,
                  memberPremium,
                  runningTotal: finalPremium
                });
              } else {
                // eslint-disable-next-line no-console
                console.log('❌ NO MATCH found for member:', {
                  member: member.name,
                  relation,
                  selectedSumInsured,
                  availableOptions: relationConfig.sum_insured_options
                });
              }
            } else {
              // eslint-disable-next-line no-console
              console.log('⚠️ No sum_insured_options for relation:', relation);
            }
          });
          
          // eslint-disable-next-line no-console
          console.log('✅ Total relation_wise premium:', finalPremium);
        } else {
          finalPremium = Number(selectedPlan.premium_amount || 0);
        }

        // Apply proration
        const prorationData = calculateProrationFactor(employee, enrollmentDetail);
        const proratedPremium = finalPremium * prorationData.prorationFactor;

        result = {
          total_premium: finalPremium,
          prorated_premium: proratedPremium,
          employee_payable: proratedPremium,
          company_contribution_amount: 0,
          sum_insured: selectedPlan?.sum_insured ? Number(selectedPlan.sum_insured) : baseSI,
          proration_factor: prorationData.prorationFactor,
          remaining_days: prorationData.remainingDays,
          total_policy_days: prorationData.totalPolicyDays,
          breakdown: (members || []).map(member => ({
            ...member,
            premium: planType === 'per_life' ? premiumPerLife : (memberCount ? (finalPremium / memberCount) : 0),
            prorated_premium: planType === 'per_life' ? (premiumPerLife * prorationData.prorationFactor) : (memberCount ? ((finalPremium / memberCount) * prorationData.prorationFactor) : 0),
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

      // Add extra coverage premium calculation with pro-rata
      let extraCoveragePremium = 0;
      if (Array.isArray(sel.extraCoverageSelected) && extraCoveragePlans.length) {
        sel.extraCoverageSelected.forEach((id) => {
          const ex = extraCoveragePlans.find((p) => String(p.id) === String(id));
          if (ex) {
            extraCoveragePremium += Number(ex.employee_contribution ?? ex.premium ?? ex.premium_amount ?? 0) || 0;
          }
        });
      }
      // Apply pro-rata to extra coverage premium
      const prorationFactor = result?.proration_factor || 1;
      extraCoveragePremium = extraCoveragePremium * prorationFactor;

      const basePremium = result ? (Number(result.prorated_premium) || 0) : 0;
      const totalWithExtra = basePremium + extraCoveragePremium;
      const gst = totalWithExtra * 0.18;
      const grossPlusGst = totalWithExtra + gst;

      // Apply company contribution to the total (including extra coverage)
      let finalEmployeePayable = basePremium + extraCoveragePremium;
      let companyContributionAmount = 0;

      if (cfg.company_contribution && Number(cfg.company_contribution_percentage) > 0) {
        companyContributionAmount = grossPlusGst * (Number(cfg.company_contribution_percentage) / 100);
        finalEmployeePayable = grossPlusGst - companyContributionAmount;
      } else {
        finalEmployeePayable = grossPlusGst;
      }

      // ...existing code...

      return {
        grossPremium: basePremium,
        basePremium: basePremium,
        extraCoveragePremium,
        totalPremium: totalWithExtra,
        gst,
        grossPlusGst,
        companyContributionAmount,
        employeePayable: Math.max(0, finalEmployeePayable),
        breakdown: result ? (result.breakdown || []) : [],
        calculationNote: result ? (result.note || '') : 'Calculated',
        sumInsured: result ? (Number(result.sum_insured) || baseSI || 0) : (baseSI || 0), // IMPORTANT: Sum insured is NEVER prorated, only premium is
        proratedPremium: result ? (Number(result.prorated_premium) || 0) : 0,
        prorationFactor: result ? (Number(result.proration_factor) || 0) : 0,
        remainingDays: result ? (Number(result.remaining_days) || 0) : 0,
        totalPolicyDays: result ? (Number(result.total_policy_days) || 0) : 0
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

  // NOTE: parent `updateFormData` is intentionally NOT called on every render here
  // to avoid an update loop. Parent sync happens on user actions (select/toggle)
  // or when the user moves to next step.

  // If dependents from parent change, sync local dependents
  useEffect(() => {
    if (formData?.dependents && Array.isArray(formData.dependents)) {
      setDependents(formData.dependents);
    }
  }, [formData?.dependents]);

  useEffect(() => {
    const incoming = formData?.selectedPlans;
    if (incoming?.selectedPlanId) {
      const incomingId = String(incoming.selectedPlanId);
      if (incomingId !== selection.selectedPlanId) {
        setSelection(prev => ({
          ...prev,
          selectedPlanId: incomingId,
          extraCoverageSelected: Array.isArray(incoming.extraCoverageSelected) 
            ? incoming.extraCoverageSelected.map(String) 
            : prev.extraCoverageSelected
        }));
      }
    }
  }, [formData?.selectedPlans?.selectedPlanId]);

  useEffect(() => {
    const computed = computePremiums(ratingConfig, selection, allMembers);
    setSelection((prev) => {
      if (JSON.stringify(prev.premiumCalculations) !== JSON.stringify(computed)) {
        return { ...prev, premiumCalculations: computed };
      }
      return prev;
    });
  }, [selection.selectedPlanId, selection.extraCoverageSelected, allMembers.length]);

  const onSelectPlan = (planId) => {
    const newPlanId = planId !== null && planId !== undefined ? String(planId) : null;
    
    // Find the selected plan to show detailed info
    const selectedPlanInfo = plansWithBase.find(p => String(p.id) === newPlanId);
    
    // eslint-disable-next-line no-console
    console.log('🎯 onSelectPlan called with:', { 
      planId, 
      newPlanId, 
      type: typeof newPlanId,
      selectedPlanInfo: selectedPlanInfo ? {
        id: selectedPlanInfo.id,
        plan_name: selectedPlanInfo.plan_name,
        sum_insured: selectedPlanInfo.sum_insured,
        premium_amount: selectedPlanInfo.premium_amount
      } : 'Plan not found'
    });
    
    setSelection((prev) => {
      // eslint-disable-next-line no-console
      console.log('🔄 Previous selection:', prev.selectedPlanId, '→ New:', newPlanId);
      if (prev.selectedPlanId === newPlanId) {
        // eslint-disable-next-line no-console
        console.log('⏭️ Same plan selected, skipping recomputation');
        return prev;
      }
      const next = {
        ...prev,
        selectedPlanId: newPlanId,
      };
      
      // eslint-disable-next-line no-console
      console.log('🧮 Computing premiums for new selection:', {
        selectedPlanId: newPlanId,
        ratingConfigPlanType: ratingConfig.plan_type,
        membersCount: allMembers.length
      });
      
      const computed = computePremiums(ratingConfig, next, allMembers);
      
      // eslint-disable-next-line no-console
      console.log('💰 Computed premium result:', {
        planId: newPlanId,
        grossPremium: computed.grossPremium,
        totalPremium: computed.totalPremium,
        employeePayable: computed.employeePayable,
        breakdown: computed.breakdown
      });
      
      return { ...next, premiumCalculations: computed };
    });
    setErrors((prev) => ({ ...prev, plan: undefined }));
  };

  const toggleExtraCoverage = (id) => {
    console.log('toggleExtraCoverage clicked:', id);
    setSelection((prev) => {
      const existing = Array.isArray(prev.extraCoverageSelected) ? prev.extraCoverageSelected.map(String) : [];
      const set = new Set(existing);
      const idStr = String(id);
      if (set.has(idStr)) set.delete(idStr);
      else set.add(idStr);
      const next = { ...prev, extraCoverageSelected: Array.from(set) };
      try {
        const computed = computePremiums(ratingConfig, next, allMembers);
        console.log('toggleExtraCoverage computed:', computed);
        return { ...next, premiumCalculations: computed };
      } catch (e) {
        console.error('toggleExtraCoverage compute error', e);
        return next;
      }
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

  const PlanCard = ({ plan }) => {
    // Single source of truth: selection.selectedPlanId (string or null)
    const planIdString = String(plan.id);
    const selectedIdString = selection.selectedPlanId;
    const selected = selectedIdString !== null && selectedIdString !== undefined && selectedIdString === planIdString;
    // Debug helper: show plan id vs selected id when clicking
    // eslint-disable-next-line no-console
    console.log('🃏 PlanCard render:', { 
      planName: plan.plan_name,
      planId: plan.id,
      planIdString,
      selectedIdString,
      exactMatch: selectedIdString === planIdString,
      selected 
    });
    const isBaseCard = plan.id === 'base_sum_insured';
    const sumInsured = plan.sum_insured ? Number(plan.sum_insured) : null;
    
    // Determine plan type for proper premium display
    const ptype = String(ratingConfig.plan_type || ratingConfig.rator_type || '').toLowerCase();
    
    // Calculate premium to display based on plan type
    let displayPremium = 0;
    let premiumLabel = 'Premium';
    
    if (ptype === 'per_life') {
      // For per_life, show premium per life
      displayPremium = Number(plan.premium_amount ?? plan.employee_premium ?? plan.premium ?? 0) || 0;
      premiumLabel = 'Per Life';
    } else if (ptype === 'floater_highest_age') {
      // For floater_highest_age, show age bracket info or "Age-based"
      if (plan.age_brackets && plan.age_brackets.length > 0) {
        // Get the first bracket as example, or find matching bracket for current age
        const bracket = plan.age_brackets[0];
        displayPremium = Number(bracket?.premium_amount || 0);
        premiumLabel = `From (Age ${bracket?.min_age || 0}-${bracket?.max_age || 99})`;
      } else {
        displayPremium = 0;
        premiumLabel = 'Age-based rates';
      }
    } else if (ptype === 'age_based') {
      // For age_based, show age bracket info
      if (plan.age_brackets && plan.age_brackets.length > 0) {
        const bracket = plan.age_brackets[0];
        displayPremium = Number(bracket?.premium_amount || 0);
        premiumLabel = `From (Age ${bracket?.min_age || 0}-${bracket?.max_age || 99})`;
      } else {
        displayPremium = 0;
        premiumLabel = 'Age-based rates';
      }
    } else {
      // For simple/other types, show plan premium
      displayPremium = Number(plan.premium_amount ?? plan.employee_premium ?? plan.premium ?? 0) || 0;
      premiumLabel = 'Premium';
    }
    
    // Calculate proration for this specific card
    const prorationMeta = calculateProrationFactor(employee, enrollmentDetail);
    const prorationFactor = prorationMeta?.prorationFactor || 1;
    const shouldProrate = prorationFactor < 1 && prorationFactor > 0;
    const proratedDisplayPremium = Math.round(displayPremium * prorationFactor);
    
    // Log proration for selected plan
    if (selected && shouldProrate) {
      console.log('💳 Plan Card Proration:', {
        planName: plan.plan_name,
        planType: ptype,
        originalPremium: displayPremium,
        prorationFactor,
        proratedPremium: proratedDisplayPremium
      });
    }

    // helper to produce tooltip text explaining how premium is calculated for this plan
    const getCalculationText = () => {
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
            <div className="text-right">
              {ptype === 'floater_highest_age' && plan.age_brackets && plan.age_brackets.length > 0 ? (
                <div>
                  <p className="text-xs font-medium text-gray-700">{premiumLabel}</p>
                  <p className="text-sm font-semibold text-green-600">{formatCurrencyLocal(proratedDisplayPremium)}</p>
                  {shouldProrate && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      (Original: {formatCurrencyLocal(displayPremium)})
                    </p>
                  )}
                </div>
              ) : ptype === 'per_life' ? (
                <div>
                  <p className="text-xs font-medium text-gray-700">{premiumLabel}</p>
                  <p className="text-sm font-semibold text-green-600">{formatCurrencyLocal(proratedDisplayPremium)}</p>
                  {shouldProrate && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      (Original: {formatCurrencyLocal(displayPremium)})
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-green-600">{formatCurrencyLocal(proratedDisplayPremium)}</p>
                  {shouldProrate && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      (Original: {formatCurrencyLocal(displayPremium)})
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1">Sum Insured: {sumInsured ? formatCurrencyLocal(sumInsured) : "Auto / base"}</p>
          {shouldProrate && (
            <p className="text-xs text-amber-600 mt-1 font-medium">
              ⏱️ Pro-rated: {(prorationFactor * 100).toFixed(1)}% ({prorationMeta.remainingDays} of {prorationMeta.totalPolicyDays} days)
            </p>
          )}
          {plan.age_brackets && plan.age_brackets.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {ptype === 'floater_highest_age' ? 'Floater plan - based on highest age' : 'Age-based rates available'}
            </p>
          )}
        </div>
      </label>
    );
  };

  // compute current breakdown to show in UI (calc)
  const calc = selection.premiumCalculations || computePremiums(ratingConfig, selection, allMembers);

  // Calculate proration factor based on joining date
  function calculateProrationFactor(emp, enrollmentDetail) {
    if (!enrollmentDetail?.policy_start_date || !enrollmentDetail?.policy_end_date || !emp?.date_of_joining) {
      console.log('⚠️ Proration: Missing required dates', {
        policy_start_date: enrollmentDetail?.policy_start_date,
        policy_end_date: enrollmentDetail?.policy_end_date,
        date_of_joining: emp?.date_of_joining
      });
      return { prorationFactor: 1, remainingDays: 0, totalPolicyDays: 0 };
    }

    const joiningDate = new Date(emp.date_of_joining || emp.doj);
    const policyStartDate = new Date(enrollmentDetail.policy_start_date);
    const policyEndDate = new Date(enrollmentDetail.policy_end_date);

    // If dates are invalid or joining <= policy start, no proration
    if (isNaN(joiningDate.getTime()) ||
        isNaN(policyStartDate.getTime()) ||
        isNaN(policyEndDate.getTime()) ||
        joiningDate <= policyStartDate) {
      console.log('ℹ️ Proration: No proration needed', {
        joiningDate: emp.date_of_joining,
        policyStartDate: enrollmentDetail.policy_start_date,
        joiningBeforeOrOnStart: joiningDate <= policyStartDate
      });
      return { prorationFactor: 1, remainingDays: 0, totalPolicyDays: 0 };
    }

    const totalPolicyDays = Math.max(1, Math.ceil((policyEndDate - policyStartDate) / (1000 * 60 * 60 * 24)));
    const remainingDays = Math.max(0, Math.ceil((policyEndDate - joiningDate) / (1000 * 60 * 60 * 24)));
    const prorationFactor = remainingDays / totalPolicyDays;

    console.log('✅ Proration calculated:', {
      joiningDate: emp.date_of_joining,
      policyStartDate: enrollmentDetail.policy_start_date,
      policyEndDate: enrollmentDetail.policy_end_date,
      totalPolicyDays,
      remainingDays,
      prorationFactor: prorationFactor.toFixed(4),
      percentage: (prorationFactor * 100).toFixed(2) + '%'
    });

    return {
      prorationFactor,
      remainingDays,
      totalPolicyDays
    };
  }

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
            {plansWithBase.map((p, idx) => <PlanCard key={`${String(p.id)}_${idx}`} plan={p} />)}
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
