Hooks.on('init', () => {
  // Quick
  CONFIG.DH.ITEM.weaponFeatures.quick = { 
    label: 'Quick',
    description: 'When you make an attack, you can mark a Stress to target another creature within range.',
    actions: [], 
    effects: []
  };

  // Scattershot
  CONFIG.DH.ITEM.weaponFeatures.scattershot = { 
    label: 'Scattershot',
    description: 'When you make an attack, target all creatures in front of you within range.',
    actions: [], 
    effects: []
  };

  // Reliable
  CONFIG.DH.ITEM.weaponFeatures.reliable = { 
    label: 'Reliable',
    description: 'Gain a +1 bonus to attack rolls.',
    actions: [], 
    effects: []
  };

  // Deadly
  CONFIG.DH.ITEM.weaponFeatures.deadly = { 
    label: 'Deadly',
    description: 'When you deal Severe damage, the target must mark an additional Hit Point.',
    actions: [], 
    effects: []
  };

  // Rapid Fire
  CONFIG.DH.ITEM.weaponFeatures.rapidFire = { 
    label: 'Rapid Fire',
    description: 'When you make an attack, you can mark a Stress to target another creature within range.',
    actions: [], 
    effects: []
  };

  // Stopping Power
  CONFIG.DH.ITEM.weaponFeatures.stoppingPower = { 
    label: 'Stopping Power',
    description: 'When you deal Major or Severe damage, you may push the target back to the edge of Very Close range.',
    actions: [], 
    effects: []
  };

  // Patient Hunter
  CONFIG.DH.ITEM.weaponFeatures.patientHunter = { 
    label: 'Patient Hunter',
    description: 'If you do not move during your spotlight, gain a +2 bonus to your attack roll.',
    actions: [], 
    effects: []
  };

  // Brutal
  CONFIG.DH.ITEM.weaponFeatures.brutal = { 
    label: 'Brutal',
    description: 'On a successful attack, you may roll an additional damage die and drop the lowest result.',
    actions: [], 
    effects: []
  };

  // Infiltrator
  CONFIG.DH.ITEM.weaponFeatures.infiltrator = { 
    label: 'Infiltrator',
    description: 'Making an attack with this weapon while hidden does not automatically reveal your position to enemies beyond Close range.',
    actions: [], 
    effects: []
  };

  // Heavy Caliber
  CONFIG.DH.ITEM.weaponFeatures.heavyCaliber = { 
    label: 'Heavy Caliber',
    description: 'This weapon’s damage ignores armor plating on vehicles. If the target is a creature, a successful attack deals Massive Damage automatically.',
    actions: [], 
    effects: []
  };

  // --- NEW FEATURES ---

  // Staggering
  CONFIG.DH.ITEM.weaponFeatures.staggering = { 
    label: 'Staggering',
    description: 'When you deal Major or Severe damage, the target is Vulnerable until the next Short Rest.',
    actions: [], 
    effects: []
  };

  // Snap Shot
  CONFIG.DH.ITEM.weaponFeatures.snapShot = { 
    label: 'Snap Shot',
    description: 'If you fail an attack roll with this weapon, you may spend 1 Hope to immediately reroll the attack.',
    actions: [], 
    effects: []
  };

  // Suppressive Fire
  CONFIG.DH.ITEM.weaponFeatures.suppressiveFire = { 
    label: 'Suppressive Fire',
    description: 'When you attack, you can mark a Stress to make the target and all enemies within Very Close Restrained.',
    actions: [], 
    effects: []
  };

  // Piercing
  CONFIG.DH.ITEM.weaponFeatures.piercing = { 
    label: 'Piercing',
    description: 'This weapon causes direct damage.',
    actions: [], 
    effects: []
  };

  // Hidden Ace
  CONFIG.DH.ITEM.weaponFeatures.hiddenAce = { 
    label: 'Hidden Ace',
    description: 'You gain advantage to any roll made to hide or conceal this weapon on your person.',
    actions: [], 
    effects: []
  };
});