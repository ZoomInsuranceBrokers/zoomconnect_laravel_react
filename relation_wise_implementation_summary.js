// Quick implementation summary for relation-wise rating

// 1. Data structure already added:
const rating_config = {
    plan_type: 'relation_wise', // New option added
    relation_wise_config: {
        self: { sum_insured: '', premium_amount: '', age_brackets: [] },
        spouse: { sum_insured: '', premium_amount: '', age_brackets: [] },
        kids: { sum_insured: '', premium_amount: '', age_brackets: [] },
        // ... other relations
    }
};

// 2. Helper functions added:
const updateRelationWiseConfig = (relation, field, value) => { /* implemented */ };
const addRelationAgeBracket = (relation) => { /* implemented */ };
const removeRelationAgeBracket = (relation, bracketIndex) => { /* implemented */ };

// 3. UI Implementation:
// - Added "Relation Wise" option to plan type selection
// - Created configuration panel showing only enabled family members
// - Each relation gets: sum insured input, premium input, age brackets
// - Age brackets allow premium multipliers by age range

// 4. Backend ready:
// - Migration created to support rating_config JSON field
// - Controller validation updated for flexible structure
// - Model updated with proper casts

export { rating_config };
