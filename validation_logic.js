// Validation logic for dependents based on policy configuration
// This assumes the config is parsed into an object as provided

const policyConfig = {
  "self":"1",
  "self_no":"1",
  "self_min_age":"25",
  "self_max_age":"80",
  "self_gender":"both",
  "spouse":"1",
  "spouse_no":"1",
  "spouse_min_age":"23",
  "spouse_max_age":"99",
  "spouse_gender":"both",
  "kid":"0",
  "kid_no":"0",
  "kid_min_age":"0",
  "kid_max_age":"25",
  "kid_gender":"both",
  "parent":"1",
  "parent_no":"2",
  "parent_min_age":"40",
  "parent_max_age":"99",
  "parent_gender":"both",
  "parent_in_law":"1",
  "parent_in_law_no":"2",
  "parent_in_law_min_age":"40",
  "parent_in_law_max_age":"99",
  "parent_in_law_gender":"both",
  "sibling":"0",
  "sibling_no":"0",
  "sibling_min_age":"18",
  "sibling_max_age":"99",
  "sibling_gender":"both",
  "partners":"0",
  "partners_no":"0",
  "partners_min_age":"18",
  "partners_max_age":"99",
  "partners_gender":"both",
  "others":"0",
  "others_no":"0",
  "others_min_age":"18",
  "others_max_age":"99",
  "others_gender":"both",
  "spouse_with_same_gender":"null",
  "add_both_parent_n_parent_in_law":"either",
  "kids":"1",
  "kids_no":"2",
  "kids_min_age":"0",
  "kids_max_age":"21"
};

// Helper to parse boolean
function parseBool(v) {
  return v === '1' || v === 1 || v === true || v === 'true';
}

// Helper to parse int
function toInt(v, fallback = 0) {
  const n = parseInt(v);
  return Number.isNaN(n) ? fallback : n;
}

// Normalize the config
function normalizeConfig(config) {
  return {
    self: {
      enabled: parseBool(config.self),
      no: toInt(config.self_no, 1),
      min_age: toInt(config.self_min_age, null),
      max_age: toInt(config.self_max_age, null),
      gender: config.self_gender || 'both'
    },
    spouse: {
      enabled: parseBool(config.spouse),
      no: toInt(config.spouse_no, 1),
      min_age: toInt(config.spouse_min_age, null),
      max_age: toInt(config.spouse_max_age, null),
      gender: config.spouse_gender || 'both'
    },
    kids: {
      enabled: parseBool(config.kids),
      no: toInt(config.kids_no, 0),
      min_age: toInt(config.kids_min_age, null),
      max_age: toInt(config.kids_max_age, null),
      gender: config.kids_gender || 'both'
    },
    parent: {
      enabled: parseBool(config.parent),
      no: toInt(config.parent_no, 0),
      min_age: toInt(config.parent_min_age, null),
      max_age: toInt(config.parent_max_age, null),
      gender: config.parent_gender || 'both'
    },
    parent_in_law: {
      enabled: parseBool(config.parent_in_law),
      no: toInt(config.parent_in_law_no, 0),
      min_age: toInt(config.parent_in_law_min_age, null),
      max_age: toInt(config.parent_in_law_max_age, null),
      gender: config.parent_in_law_gender || 'both'
    },
    sibling: {
      enabled: parseBool(config.sibling),
      no: toInt(config.sibling_no, 0),
      min_age: toInt(config.sibling_min_age, null),
      max_age: toInt(config.sibling_max_age, null),
      gender: config.sibling_gender || 'both'
    },
    partners: {
      enabled: parseBool(config.partners),
      no: toInt(config.partners_no, 0),
      min_age: toInt(config.partners_min_age, null),
      max_age: toInt(config.partners_max_age, null),
      gender: config.partners_gender || 'both'
    },
    others: {
      enabled: parseBool(config.others),
      no: toInt(config.others_no, 0),
      min_age: toInt(config.others_min_age, null),
      max_age: toInt(config.others_max_age, null),
      gender: config.others_gender || 'both'
    },
    spouse_with_same_gender: config.spouse_with_same_gender === '1' || config.spouse_with_same_gender === 1 || config.spouse_with_same_gender === true,
    add_both_parent_n_parent_in_law: config.add_both_parent_n_parent_in_law || 'both'
  };
}

const normalizedConfig = normalizeConfig(policyConfig);

// Age calculation
function calculateAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

// Validation function
function validateDependents(dependents, employeeGender = null) {
  const errors = [];

  // Group dependents by relation
  const counts = {};
  dependents.forEach(dep => {
    const rel = dep.relation;
    counts[rel] = (counts[rel] || 0) + 1;
  });

  // Check each dependent
  dependents.forEach((dep, index) => {
    const rel = dep.relation;
    let configKey = rel;
    if (rel === 'SON' || rel === 'DAUGHTER') configKey = 'kids';
    if (rel === 'FATHER' || rel === 'MOTHER') configKey = 'parent';
    if (rel === 'FATHER_IN_LAW' || rel === 'MOTHER_IN_LAW') configKey = 'parent_in_law';

    const config = normalizedConfig[configKey];
    if (!config) {
      errors.push(`Unknown relation: ${rel}`);
      return;
    }

    // 1. Check if allowed
    if (!config.enabled) {
      errors.push(`${rel} is not allowed in this policy.`);
      return;
    }

    // 2. Check count
    if (counts[rel] > config.no) {
      errors.push(`Maximum ${config.no} ${rel} allowed.`);
    }

    // 3. Age limits
    const age = calculateAge(dep.dob);
    if (age !== null) {
      if (config.min_age !== null && age < config.min_age) {
        errors.push(`${rel} minimum age is ${config.min_age}.`);
      }
      if (config.max_age !== null && age > config.max_age) {
        errors.push(`${rel} maximum age is ${config.max_age}.`);
      }
    }

    // 4. Gender restrictions
    if (config.gender !== 'both') {
      if (config.gender === 'male' && dep.gender !== 'MALE') {
        errors.push(`${rel} must be male.`);
      }
      if (config.gender === 'female' && dep.gender !== 'FEMALE') {
        errors.push(`${rel} must be female.`);
      }
    }

    // Spouse same gender
    if (rel === 'SPOUSE' && normalizedConfig.spouse_with_same_gender !== true) {
      if (employeeGender && dep.gender === employeeGender) {
        errors.push('Same-gender spouse is not allowed.');
      }
    }
  });

  // 5. Parent combination rules
  const parentCount = (counts.FATHER || 0) + (counts.MOTHER || 0);
  const parentInLawCount = (counts.FATHER_IN_LAW || 0) + (counts.MOTHER_IN_LAW || 0);
  const rule = normalizedConfig.add_both_parent_n_parent_in_law;
  if (rule === 'either') {
    if (parentCount > 0 && parentInLawCount > 0) {
      errors.push('Cannot add both parents and parents-in-law.');
    }
  } else if (rule === 'cross_combination') {
    const total = parentCount + parentInLawCount;
    if (total > 2) {
      errors.push('Maximum 2 parents/in-laws allowed, with mixing permitted.');
    }
  } else if (rule === 'both') {
    // No restriction
  }

  return errors;
}

// Example usage:
// const dependents = [
//   { relation: 'SELF', dob: '1990-01-01', gender: 'MALE' },
//   { relation: 'SPOUSE', dob: '1992-01-01', gender: 'FEMALE' },
//   { relation: 'SON', dob: '2015-01-01', gender: 'MALE' }
// ];
// const errs = validateDependents(dependents, 'MALE');
// console.log(errs);