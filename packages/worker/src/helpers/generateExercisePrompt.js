module.exports = function generateExercisePrompt(client, healthRecord, injury) {
  const prompt = `
    Based on the following client profile, health record, and injury, please suggest appropriate exercises:

    Client Profile:
    - Sex: ${client.sex}
    - Age: ${client.age} years old

    Health Record:
    - Range of Motion:
      * Forward Flexion: ${healthRecord.rom.forward_flexion} degrees
      * Abduction: ${healthRecord.rom.abduction} degrees
      * External Rotation: ${healthRecord.rom.external_rotation} degrees
      * Internal Rotation: ${healthRecord.rom.internal_rotation} degrees
    - Strength:
      * Supraspinatus: ${healthRecord.strength.supraspinatus}
      * Adduction: ${healthRecord.strength.adduction}
      * External Rotation: ${healthRecord.strength.external_rotation}
      * Internal Rotation: ${healthRecord.strength.internal_rotation}
      * Liftoff: ${healthRecord.strength.liftoff}
    - Pain Levels:
      * At rest: ${healthRecord.pain.rest}
      * When sleeping: ${healthRecord.pain.sleep}
      * When active: ${healthRecord.pain.active}

    Injury Details:
    - Days Since Injury: ${injury.days_since_injury}
    - Joint:${injury.side} ${injury.joint}
    ${injury.diagnosis ? `
    - Diagnosis:
      * Tear: ${injury.diagnosis.tear ? 'Yes' : 'No'}
      * Diagnosis: ${injury.diagnosis.diagnosis}
      * Recommended Treatment: ${injury.diagnosis.treatment}
      * Estimated Recovery Time: ${injury.diagnosis.estimated_recovery_time} days` : 'Diagnosis: Pending'}

    Please suggest exercises that would be suitable for rehabilitation or maintaining fitness, taking into account the client's limitations and pain levels.
  `;

  return prompt.trim();
};
