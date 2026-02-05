/**
 * ========================================
 * 🎯 ROBUST PREMIUM CALCULATION SYSTEM
 * ========================================
 *
 * Main function: calculatePremium(employee, dependents, policyData, selectedPlanId)
 *
 * Supports all rator types:
 * - simple
 * - floater_highest_age
 * - age_based
 * - per_life
 * - relation_wise
 */

/**
 * Calculate premium for GMC enrollment
 * @param {Object} employee - Employee data
 * @param {Array} dependents - Array of dependents
 * @param {Object} policyData - Policy configuration
 * @param {String|Number} selectedPlanId - Selected plan ID (optional)
 * @returns {Object} Premium calculation result
 */
export function calculatePremium(employee, dependents = [], policyData = {}, selectedPlanId = null) {
  try {
    // Normalize inputs
    const emp = employee || {};
    const deps = Array.isArray(dependents) ? dependents : [];
    const policy = policyData || {};

    // Extract policy configuration
    const planType = String(policy.plan_type || policy.rator_type || 'simple').toLowerCase();
    const plans = Array.isArray(policy.plans) ? policy.plans : [];
    const baseSumInsured = getBaseSumInsured(policy, emp);
    const companyContribution = Boolean(policy.company_contribution);
    const companyPercentage = Number(policy.company_contribution_percentage || 0);

    console.log('🎯 Premium Calculator - Finding selected plan:', {
      selectedPlanId,
      selectedPlanIdType: typeof selectedPlanId,
      availablePlans: plans.map(p => ({ id: p.id, idType: typeof p.id, name: p.plan_name, premium: p.premium_amount })),
      planType
    });

    // Find selected plan - handle null IDs by comparing plan_name as fallback
    let selectedPlan = null;
    if (selectedPlanId && selectedPlanId !== 'null') {
      // First try direct ID match
      selectedPlan = plans.find(p => {
        const planIdStr = p.id !== null && p.id !== undefined ? String(p.id) : null;
        return planIdStr === String(selectedPlanId);
      });
      
      // If no match and selectedPlanId looks like our generated ID format, try to extract plan name
      if (!selectedPlan && String(selectedPlanId).startsWith('plan_')) {
        const planNameFromId = String(selectedPlanId).split('_').slice(2).join('_');
        selectedPlan = plans.find(p => p.plan_name?.replace(/\s+/g, '_').toLowerCase() === planNameFromId);
      }
    }
    
    // Fallback to first plan if still not found
    if (!selectedPlan && plans.length > 0) {
      console.warn('⚠️ Could not find selected plan, defaulting to first plan');
      selectedPlan = plans[0];
    }

    console.log('✅ Premium Calculator - Selected plan:', selectedPlan ? {
      id: selectedPlan.id,
      plan_name: selectedPlan.plan_name,
      premium_amount: selectedPlan.premium_amount,
      sum_insured: selectedPlan.sum_insured
    } : 'NO PLAN FOUND');

    // Build all members (employee + dependents)
    const allMembers = buildAllMembers(emp, deps);

    // Calculate base premium based on rator type
    let totalPremium = 0;
    let breakdown = [];

    switch (planType) {
      case 'simple':
        ({ totalPremium, breakdown } = calculateSimplePremium(allMembers, selectedPlan, policy));
        break;
      case 'floater_highest_age':
        ({ totalPremium, breakdown } = calculateFloaterHighestAge(allMembers, selectedPlan, policy));
        break;
      case 'age_based':
        ({ totalPremium, breakdown } = calculateAgeBased(allMembers, selectedPlan, policy));
        break;
      case 'per_life':
        ({ totalPremium, breakdown } = calculatePerLife(allMembers, selectedPlan, policy));
        break;
      case 'relation_wise':
        ({ totalPremium, breakdown } = calculateRelationWise(allMembers, selectedPlan, policy));
        break;
      default:
        ({ totalPremium, breakdown } = calculateSimplePremium(allMembers, selectedPlan, policy));
    }

    // Apply proration if employee joined after policy start
    const prorationData = calculateProration(emp, policy, totalPremium);

    // Apply company contribution
    const contributionData = calculateCompanyContribution(
      prorationData.proratedPremium,
      companyContribution,
      companyPercentage
    );

    // Determine final sum insured - IMPORTANT: Sum insured is NEVER prorated, only premium is
    const sumInsured = selectedPlan?.sum_insured || baseSumInsured || 0;

    // Extract extra coverages
    const extraCoverages = extractExtraCoverages(selectedPlan || policy);

    return {
      plan_type: planType,
      total_premium: totalPremium,
      prorated_premium: prorationData.proratedPremium,
      employee_payable: contributionData.employeePayable,
      sum_insured: sumInsured,
      grade_based_sum_insured: policy.base_sum_insured_type === 'grade_wise',
      company_contribution: companyContribution,
      company_contribution_amount: contributionData.companyContribution,
      dependents_count: allMembers.length,
      proration_factor: prorationData.prorationFactor,
      remaining_days: prorationData.remainingDays,
      total_policy_days: prorationData.totalPolicyDays,
      breakdown: breakdown,
      extra_coverages: extraCoverages,
      note: generateCalculationNote(planType, totalPremium, baseSumInsured)
    };

  } catch (error) {
    console.error('Premium calculation error:', error);
    return {
      plan_type: 'error',
      total_premium: 0,
      prorated_premium: 0,
      employee_payable: 0,
      sum_insured: 0,
      grade_based_sum_insured: false,
      company_contribution: false,
      company_contribution_amount: 0,
      dependents_count: 0,
      proration_factor: 1,
      remaining_days: 0,
      total_policy_days: 0,
      breakdown: [],
      extra_coverages: { co_pay: false, maternity: false, room_rent: false },
      note: `Error in calculation: ${error.message}`,
      error: true
    };
  }
}

/**
 * Get base sum insured based on type (fixed or grade_wise)
 */
function getBaseSumInsured(policy, employee) {
  const baseSumInsuredType = policy.base_sum_insured_type || 'fixed';

  if (baseSumInsuredType === 'grade_wise') {
    const employeeGrade = String(employee.grade || '').trim();
    const gradeWiseConfig = Array.isArray(policy.grade_wise_sum_insured)
      ? policy.grade_wise_sum_insured
      : [];

    const gradeMatch = gradeWiseConfig.find(g =>
      String(g.grade_name || '').trim() === employeeGrade
    );

    if (gradeMatch && gradeMatch.sum_insured) {
      return Number(gradeMatch.sum_insured);
    }

    // Fallback to base_sum_insured if grade not found
    return Number(policy.base_sum_insured || 0);
  }

  return Number(policy.base_sum_insured || 0);
}

/**
 * Build all members array (employee + dependents)
 */
function buildAllMembers(employee, dependents) {
  const empMember = {
    id: employee.id || 'employee',
    name: employee.full_name || employee.name || 'Employee',
    relation: 'SELF',
    age: calculateAge(employee.date_of_birth || employee.dob) || employee.age || 0,
    gender: employee.gender || 'MALE',
    isEmployee: true
  };

  const depMembers = dependents
    .filter(d => d.relation !== 'SELF') // Avoid duplicate SELF
    .map(d => ({
      id: d.id || Math.random().toString(36).substr(2, 9),
      name: d.insured_name || d.name || '',
      relation: d.relation || 'OTHERS',
      age: d.age || calculateAge(d.dob) || 0,
      gender: d.gender || 'MALE',
      isEmployee: false
    }));

  return [empMember, ...depMembers];
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dob) {
  if (!dob) return 0;

  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * SIMPLE premium calculation
 */
function calculateSimplePremium(members, selectedPlan, policy) {
  const planPremium = selectedPlan
    ? Number(selectedPlan.premium_amount || selectedPlan.employee_premium || 0)
    : 0;

  // For simple plans, premium is usually fixed regardless of member count
  // But if premium_amount > 0, apply it
  const totalPremium = planPremium;

  const breakdown = members.map(member => ({
    ...member,
    premium: totalPremium / members.length, // Distribute evenly for display
    age_bracket: null,
    calculation_note: 'Simple fixed premium'
  }));

  return { totalPremium, breakdown };
}

/**
 * FLOATER_HIGHEST_AGE premium calculation
 */
function calculateFloaterHighestAge(members, selectedPlan, policy) {
  if (!selectedPlan) {
    console.warn('⚠️ calculateFloaterHighestAge: No selected plan');
    return { totalPremium: 0, breakdown: members.map(m => ({ ...m, premium: 0 })) };
  }

  // Find highest age
  const ages = members.map(m => Number(m.age || 0));
  const highestAge = Math.max(...ages);

  console.log('👴 Floater Highest Age Calculation:', {
    planName: selectedPlan.plan_name,
    memberAges: ages,
    highestAge,
    hasAgeBrackets: !!(selectedPlan.age_brackets && selectedPlan.age_brackets.length)
  });

  // Find applicable age bracket
  const ageBracket = findAgeBracket(selectedPlan, highestAge);
  
  // For floater_highest_age, premium is in age_brackets, not at plan level
  let premium = 0;
  if (ageBracket) {
    premium = Number(ageBracket.premium_amount || ageBracket.premium || 0);
    console.log('✅ Found matching age bracket:', {
      minAge: ageBracket.min_age,
      maxAge: ageBracket.max_age,
      premium
    });
  } else {
    // Fallback to plan-level premium if no bracket found (shouldn't happen)
    premium = Number(selectedPlan.premium_amount || selectedPlan.employee_premium || 0);
    console.warn('⚠️ No matching age bracket found, using plan-level premium:', premium);
  }

  const breakdown = members.map(member => ({
    ...member,
    premium: member.age === highestAge ? premium : 0, // Only show on highest age member
    age_bracket: member.age === highestAge ? ageBracket : null,
    calculation_note: member.age === highestAge
      ? `Floater premium based on highest age (${highestAge}): ₹${premium}`
      : 'Covered under floater plan'
  }));

  return { totalPremium: premium, breakdown };
}

/**
 * AGE_BASED premium calculation
 */
function calculateAgeBased(members, selectedPlan, policy) {
  if (!selectedPlan) {
    console.warn('⚠️ calculateAgeBased: No selected plan');
    return { totalPremium: 0, breakdown: members.map(m => ({ ...m, premium: 0 })) };
  }

  console.log('📊 Age-Based Calculation:', {
    planName: selectedPlan.plan_name,
    memberCount: members.length,
    hasAgeBrackets: !!(selectedPlan.age_brackets && selectedPlan.age_brackets.length)
  });

  let totalPremium = 0;
  const breakdown = members.map(member => {
    const age = Number(member.age || 0);
    const ageBracket = findAgeBracket(selectedPlan, age);
    const memberPremium = ageBracket
      ? Number(ageBracket.premium_amount || ageBracket.premium || 0)
      : Number(selectedPlan.premium_amount || selectedPlan.employee_premium || 0);

    totalPremium += memberPremium;

    console.log(`👤 Member ${member.name}: age ${age}, premium ₹${memberPremium}`);

    return {
      ...member,
      premium: memberPremium,
      age_bracket: ageBracket,
      calculation_note: `Age-based premium for age ${age}: ₹${memberPremium}`
    };
  });

  console.log('✅ Age-Based Total Premium:', totalPremium);

  return { totalPremium, breakdown };
}

/**
 * PER_LIFE premium calculation
 */
function calculatePerLife(members, selectedPlan, policy) {
  if (!selectedPlan) {
    console.warn('⚠️ calculatePerLife: No selected plan');
    return { totalPremium: 0, breakdown: members.map(m => ({ ...m, premium: 0 })) };
  }

  // For per_life plans, premium_amount is at the plan level (not in age_brackets)
  const planPremium = Number(selectedPlan.premium_amount || selectedPlan.employee_premium || 0);
  
  console.log('💰 Per Life Calculation:', {
    planName: selectedPlan.plan_name,
    premiumPerLife: planPremium,
    memberCount: members.length,
    totalPremium: planPremium * members.length
  });

  const totalPremium = planPremium * members.length;

  const breakdown = members.map(member => ({
    ...member,
    premium: planPremium,
    age_bracket: null,
    calculation_note: `Per-life premium: ₹${planPremium}`
  }));

  return { totalPremium, breakdown };
}

/**
 * RELATION_WISE premium calculation
 */
function calculateRelationWise(members, selectedPlan, policy) {
  const relationConfig = policy.relation_wise_config || {};
  let totalPremium = 0;

  const breakdown = members.map(member => {
    const relation = member.relation.toLowerCase();
    const relationData = relationConfig[relation] || relationConfig.others || {};
    const sumInsuredOptions = Array.isArray(relationData.sum_insured_options)
      ? relationData.sum_insured_options
      : [];

    // Use first available option or default
    const option = sumInsuredOptions[0] || {};
    const age = Number(member.age || 0);
    const ageBracket = findAgeBracket(option, age);

    const memberPremium = ageBracket
      ? Number(ageBracket.premium_amount || ageBracket.premium || 0)
      : Number(option.premium_amount || 0);

    totalPremium += memberPremium;

    return {
      ...member,
      premium: memberPremium,
      age_bracket: ageBracket,
      calculation_note: `Relation-wise premium for ${member.relation}`
    };
  });

  return { totalPremium, breakdown };
}

/**
 * Find age bracket for given age
 */
function findAgeBracket(plan, age) {
  if (!plan || !Array.isArray(plan.age_brackets)) return null;

  return plan.age_brackets.find(bracket => {
    const minAge = Number(bracket.min_age || bracket.min || 0);
    const maxAge = Number(bracket.max_age || bracket.max || 999);
    return age >= minAge && age <= maxAge;
  });
}

/**
 * Calculate proration based on joining date
 */
function calculateProration(employee, policy, totalPremium) {
  const joiningDate = new Date(employee.date_of_joining || employee.doj || '');
  const policyStartDate = new Date(policy.policy_start_date || '');
  const policyEndDate = new Date(policy.policy_end_date || '');

  // If dates are invalid or joining <= policy start, no proration
  if (isNaN(joiningDate.getTime()) ||
      isNaN(policyStartDate.getTime()) ||
      isNaN(policyEndDate.getTime()) ||
      joiningDate <= policyStartDate) {
    return {
      proratedPremium: totalPremium,
      prorationFactor: 1,
      remainingDays: 0,
      totalPolicyDays: 0
    };
  }

  const totalPolicyDays = Math.max(1, Math.ceil((policyEndDate - policyStartDate) / (1000 * 60 * 60 * 24)));
  const remainingDays = Math.max(0, Math.ceil((policyEndDate - joiningDate) / (1000 * 60 * 60 * 24)));
  const prorationFactor = remainingDays / totalPolicyDays;
  const proratedPremium = totalPremium * prorationFactor;

  return {
    proratedPremium,
    prorationFactor,
    remainingDays,
    totalPolicyDays
  };
}

/**
 * Calculate company contribution
 */
function calculateCompanyContribution(proratedPremium, companyContribution, percentage) {
  if (!companyContribution || percentage <= 0) {
    return {
      employeePayable: proratedPremium,
      companyContribution: 0
    };
  }

  const companyAmount = proratedPremium * (percentage / 100);
  const employeePayable = proratedPremium - companyAmount;

  return {
    employeePayable: Math.max(0, employeePayable),
    companyContribution: companyAmount
  };
}

/**
 * Extract extra coverages
 */
function extractExtraCoverages(planOrPolicy) {
  const source = planOrPolicy || {};
  const extraCoverages = source.extra_coverages || {};

  return {
    co_pay: Boolean(extraCoverages.co_pay),
    maternity: Boolean(extraCoverages.maternity),
    room_rent: Boolean(extraCoverages.room_rent),
    ...extraCoverages // Include any additional coverages
  };
}

/**
 * Generate calculation note
 */
function generateCalculationNote(planType, totalPremium, baseSumInsured) {
  if (totalPremium === 0) {
    return baseSumInsured > 0
      ? "Company-paid plan — no employee premium required."
      : "No premium calculated — check plan configuration.";
  }

  switch (planType) {
    case 'simple':
      return "Simple rator plan — fixed premium regardless of age or relation.";
    case 'floater_highest_age':
      return "Floater plan — premium based on highest age in family.";
    case 'age_based':
      return "Age-based plan — premium calculated per member's age.";
    case 'per_life':
      return "Per-life plan — same premium charged per covered member.";
    case 'relation_wise':
      return "Relation-wise plan — premium varies by relationship type.";
    default:
      return "Premium calculated based on plan configuration.";
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount || 0));
}

/**
 * Validate premium calculation inputs
 */
export function validatePremiumInputs(employee, dependents, policyData) {
  const errors = [];

  if (!employee || typeof employee !== 'object') {
    errors.push('Employee data is required');
  }

  if (!Array.isArray(dependents)) {
    errors.push('Dependents must be an array');
  }

  if (!policyData || typeof policyData !== 'object') {
    errors.push('Policy data is required');
  }

  if (policyData && !policyData.plan_type && !policyData.rator_type) {
    errors.push('Plan type is required in policy data');
  }

  return errors;
}
