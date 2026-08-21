export class RuleEngine {
  constructor({ movementRules, ajetrezRules }) {
    this.movementRules = movementRules;
    this.ajetrezRules = ajetrezRules;
  }

  validateMove(game, piece, destination) {
    const movementResult = this.movementRules.validate(
      game, piece, destination
    );

    if (!movementResult.valid) return movementResult;

    const ajetrezResult = this.ajetrezRules.validateMove(
      game, piece, destination
    );

    if (!ajetrezResult.valid) return ajetrezResult;

    return { valid: true, reason: null };
  }
}
