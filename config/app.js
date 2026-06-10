// TRR Operations Hub — Central Config
// To add a new form: add an entry to FORMS. To add a category: add to CATEGORIES.

const TRR_CONFIG = {

  // ── APP SETTINGS ───────────────────────────────────────────────────────────
  appName: 'TRR Operations Hub',
  ranchName: 'Tunnel Ridge Ranch',
  managerPin: '1234',        // Change before going live
  appsScriptUrl: 'YOUR_APPS_SCRIPT_URL_HERE',
  driveFolderId: 'YOUR_DRIVE_FOLDER_ID_HERE',

  // ── STAFF LIST ─────────────────────────────────────────────────────────────
  staff: [
    'Select your name...',
    'Sam',
    'Jake',
    'Emma',
    'Lily',
    'Tom',
    'Sarah',
    'Mia',
    'Jack',
    'Other',
  ],

  // ── CATEGORIES ─────────────────────────────────────────────────────────────
  categories: [
    {
      id: 'cleaning',
      label: 'Cleaning',
      icon: 'ti-sparkles',
      color: 'green',
      forms: ['tent-cleaning','tent-toilet-cleaning','dorm-cleaning','dorm-toilet-cleaning'],
    },
    {
      id: 'safety',
      label: 'Safety & Compliance',
      icon: 'ti-shield-check',
      color: 'blue',
      forms: ['smoke-alarm-testing','smoke-alarm-cleaning','smoke-alarm-battery','water-tanks','swim-dam'],
    },
    {
      id: 'food',
      label: 'Food Safety',
      icon: 'ti-temperature',
      color: 'amber',
      forms: ['protein-temp-check'],
    },
  ],

  // ── LOCATIONS ──────────────────────────────────────────────────────────────
  tentLocations: [
    'Tent 1','Tent 2','Tent 3','Tent 4','Tent 5',
    'Tent 6','Tent 7','Tent 8','Tent 9','Tent 10',
  ],
  tentToiletLocations: [
    'Tent Toilet Block A','Tent Toilet Block B','Tent Shower Block A','Tent Shower Block B',
  ],
  dormLocations: [
    'Dorm 1','Dorm 2','Dorm 3','Dorm 4',
  ],
  dormToiletLocations: [
    'Dorm Toilet Block 1','Dorm Toilet Block 2','Dorm Shower Block 1','Dorm Shower Block 2',
  ],
  smokeAlarmLocations: [
    'Main Lodge','Dining Hall','Dorm 1','Dorm 2','Dorm 3','Dorm 4',
    'Staff Quarters','Maintenance Shed','Nurse Station',
  ],
  waterTankLocations: [
    'Main Tank A','Main Tank B','Drinking Water Tank','Camp Tank',
  ],

  // ── FORMS ──────────────────────────────────────────────────────────────────
  forms: {

    'tent-cleaning': {
      id: 'tent-cleaning',
      title: 'Tent Cleaning',
      category: 'cleaning',
      sheetTab: 'Tent Cleaning',
      instructionTitle: 'Before you start',
      instructions: [
        'Select the tent you are cleaning from the location dropdown',
        'Work through the checklist — check each item as you complete it',
        'If any item cannot be completed, note it in the comments field',
        'Submit the form when finished — your name and time will be recorded automatically',
      ],
      fields: [
        { type: 'date',     key: 'date',     label: 'Date',     auto: true,  required: true },
        { type: 'select',   key: 'staff',    label: 'Your name', options: 'staff', required: true },
        { type: 'select',   key: 'location', label: 'Tent',     options: 'tentLocations', required: true },
        { type: 'checklist', key: 'checklist', label: 'Cleaning checklist', items: [
          'Remove all rubbish and empty bins',
          'Sweep/vacuum floor',
          'Wipe down all surfaces and benches',
          'Clean mirrors',
          'Make all beds with fresh linen',
          'Restock supplies (soap, toilet paper, etc.)',
          'Check for damage or maintenance issues',
          'Final inspection — tent ready for guests',
        ]},
        { type: 'textarea', key: 'notes', label: 'Comments, damage or maintenance notes', hint: 'Note anything that needs follow-up', required: false },
      ],
    },

    'tent-toilet-cleaning': {
      id: 'tent-toilet-cleaning',
      title: 'Tent Toilet / Shower Cleaning',
      category: 'cleaning',
      sheetTab: 'Tent Toilet Cleaning',
      instructionTitle: 'Before you start',
      instructions: [
        'Select the toilet or shower block from the dropdown',
        'Work through the full checklist before submitting',
        'Note any damage or supply needs in the comments',
      ],
      fields: [
        { type: 'date',    key: 'date',     label: 'Date',   auto: true, required: true },
        { type: 'select',  key: 'staff',    label: 'Your name', options: 'staff', required: true },
        { type: 'select',  key: 'location', label: 'Block',  options: 'tentToiletLocations', required: true },
        { type: 'checklist', key: 'checklist', label: 'Cleaning checklist', items: [
          'Clean and disinfect all toilets',
          'Clean all basins and tapware',
          'Scrub shower recesses / floor tiles',
          'Clean mirrors',
          'Mop floors with disinfectant',
          'Empty rubbish bins',
          'Restock toilet paper, soap, paper towels',
          'Check for mould — treat if present',
          'Check drains are clear',
          'Final inspection',
        ]},
        { type: 'textarea', key: 'notes', label: 'Comments, damage or maintenance notes', required: false },
      ],
    },

    'dorm-cleaning': {
      id: 'dorm-cleaning',
      title: 'Dorm Cleaning',
      category: 'cleaning',
      sheetTab: 'Dorm Cleaning',
      instructionTitle: 'Before you start',
      instructions: [
        'Select the dorm building from the dropdown',
        'Complete the checklist for the full dorm',
        'Note any maintenance issues in the comments',
      ],
      fields: [
        { type: 'date',    key: 'date',     label: 'Date',  auto: true, required: true },
        { type: 'select',  key: 'staff',    label: 'Your name', options: 'staff', required: true },
        { type: 'select',  key: 'location', label: 'Dorm',  options: 'dormLocations', required: true },
        { type: 'checklist', key: 'checklist', label: 'Cleaning checklist', items: [
          'Sweep and mop all floors',
          'Vacuum carpeted areas',
          'Wipe down all bunks and surfaces',
          'Clean windows and window sills',
          'Empty all rubbish bins',
          'Check under beds for lost property or rubbish',
          'Restock supplies',
          'Check for damage or maintenance issues',
          'Final inspection',
        ]},
        { type: 'textarea', key: 'notes', label: 'Comments, damage or maintenance notes', required: false },
      ],
    },

    'dorm-toilet-cleaning': {
      id: 'dorm-toilet-cleaning',
      title: 'Dorm Toilet / Shower Cleaning',
      category: 'cleaning',
      sheetTab: 'Dorm Toilet Cleaning',
      instructionTitle: 'Before you start',
      instructions: [
        'Select the toilet or shower block from the dropdown',
        'Complete the full checklist',
        'Report any damage or supply issues in the comments',
      ],
      fields: [
        { type: 'date',    key: 'date',     label: 'Date',   auto: true, required: true },
        { type: 'select',  key: 'staff',    label: 'Your name', options: 'staff', required: true },
        { type: 'select',  key: 'location', label: 'Block',  options: 'dormToiletLocations', required: true },
        { type: 'checklist', key: 'checklist', label: 'Cleaning checklist', items: [
          'Clean and disinfect all toilets',
          'Clean all basins and tapware',
          'Scrub shower recesses / floor tiles',
          'Clean mirrors',
          'Mop all floors with disinfectant',
          'Empty rubbish bins',
          'Restock supplies',
          'Check for mould — treat if present',
          'Check drains are clear',
          'Final inspection',
        ]},
        { type: 'textarea', key: 'notes', label: 'Comments, damage or maintenance notes', required: false },
      ],
    },

    'smoke-alarm-testing': {
      id: 'smoke-alarm-testing',
      title: 'Smoke Alarm Testing',
      category: 'safety',
      sheetTab: 'Smoke Alarm Testing',
      instructionTitle: 'Testing procedure',
      instructions: [
        'Test each smoke alarm by pressing and holding the test button for 5–10 seconds',
        'Alarm should sound clearly — if it doesn\'t, replace battery and retest',
        'Record the result for each location',
        'Notify your manager immediately if any alarm fails and cannot be resolved',
      ],
      fields: [
        { type: 'date',   key: 'date',  label: 'Date', auto: true, required: true },
        { type: 'select', key: 'staff', label: 'Your name', options: 'staff', required: true },
        { type: 'location-checklist', key: 'results', label: 'Test results by location',
          locations: 'smokeAlarmLocations',
          options: ['Pass','Fail — battery replaced','Fail — needs attention'],
        },
        { type: 'textarea', key: 'notes', label: 'Notes or follow-up required', required: false },
      ],
    },

    'smoke-alarm-cleaning': {
      id: 'smoke-alarm-cleaning',
      title: 'Smoke Alarm Cleaning Record',
      category: 'safety',
      sheetTab: 'Smoke Alarm Cleaning',
      instructionTitle: 'Cleaning procedure',
      instructions: [
        'Use a soft brush or compressed air to clear dust from the alarm vents',
        'Do not use water or cleaning products on the alarm unit',
        'Check the indicator light is green after cleaning',
        'Record each location below',
      ],
      fields: [
        { type: 'date',   key: 'date',  label: 'Date', auto: true, required: true },
        { type: 'select', key: 'staff', label: 'Your name', options: 'staff', required: true },
        { type: 'location-checklist', key: 'results', label: 'Cleaned — confirm each location',
          locations: 'smokeAlarmLocations',
          options: ['Cleaned','Skipped — note below'],
        },
        { type: 'textarea', key: 'notes', label: 'Notes', required: false },
      ],
    },

    'smoke-alarm-battery': {
      id: 'smoke-alarm-battery',
      title: 'Smoke Alarm Battery Replacement',
      category: 'safety',
      sheetTab: 'Smoke Alarm Battery',
      instructionTitle: 'Replacement procedure',
      instructions: [
        'Replace battery with correct type (check label on alarm)',
        'Press test button after replacement to confirm operation',
        'Write the replacement date on the inside of the battery cover',
      ],
      fields: [
        { type: 'date',   key: 'date',  label: 'Date', auto: true, required: true },
        { type: 'select', key: 'staff', label: 'Your name', options: 'staff', required: true },
        { type: 'location-checklist', key: 'results', label: 'Battery replaced — confirm each location',
          locations: 'smokeAlarmLocations',
          options: ['Replaced & tested','Not required'],
        },
        { type: 'textarea', key: 'notes', label: 'Notes', required: false },
      ],
    },

    'water-tanks': {
      id: 'water-tanks',
      title: 'Record of Water Tanks & Filters',
      category: 'safety',
      sheetTab: 'Water Tanks',
      instructionTitle: 'Before you start',
      instructions: [
        'Check each tank\'s water level and condition',
        'Record filter status and date last changed where applicable',
        'Note any odour, discolouration, or sediment',
        'Flag any issues to the manager immediately',
      ],
      fields: [
        { type: 'date',   key: 'date',  label: 'Date', auto: true, required: true },
        { type: 'select', key: 'staff', label: 'Your name', options: 'staff', required: true },
        { type: 'select', key: 'location', label: 'Tank / location', options: 'waterTankLocations', required: true },
        { type: 'select', key: 'water_level', label: 'Water level', options: ['Select...','Full','75%','50%','25%','Low — needs attention'], required: true },
        { type: 'select', key: 'water_condition', label: 'Water condition', options: ['Select...','Clear and odourless','Slight colour','Odour present','Sediment present'], required: true },
        { type: 'select', key: 'filter_status', label: 'Filter status', options: ['Select...','OK','Due for replacement','Replaced today','N/A — no filter'], required: true },
        { type: 'textarea', key: 'notes', label: 'Notes or issues to flag', required: false },
      ],
    },

    'swim-dam': {
      id: 'swim-dam',
      title: 'Swim Dam Chemical Record',
      category: 'safety',
      sheetTab: 'Swim Dam',
      instructionTitle: 'Chemical test procedure',
      instructions: [
        'Collect water sample from mid-depth at the swim area',
        'Use test strips — compare to colour chart on bottle',
        'Record all readings below',
        'If any reading is outside acceptable range, do not open the swim area without manager approval',
      ],
      fields: [
        { type: 'date',   key: 'date',  label: 'Date', auto: true, required: true },
        { type: 'select', key: 'staff', label: 'Your name', options: 'staff', required: true },
        { type: 'select', key: 'time_of_test', label: 'Time of test', options: ['Select...','Morning (before swim)','Midday check','Afternoon check','Evening (after swim)'], required: true },
        { type: 'text',   key: 'free_chlorine', label: 'Free chlorine level', hint: 'Target: 2–4 ppm', required: false },
        { type: 'text',   key: 'ph_level', label: 'pH level', hint: 'Target: 7.2–7.6', required: false },
        { type: 'text',   key: 'total_alkalinity', label: 'Total alkalinity', hint: 'Target: 80–120 ppm', required: false },
        { type: 'text',   key: 'stabilizer', label: 'Stabilizer / cyanuric acid', hint: 'Target: 30–50 ppm', required: false },
        { type: 'select', key: 'swim_safe', label: 'Safe to swim?', options: ['Select...','Yes — all readings normal','Yes — with caution, manager notified','No — swim area closed'], required: true },
        { type: 'photo',  key: 'test_strip_photo', label: 'Photo of test strip', hint: 'Take photo of test strip next to colour chart', required: false },
        { type: 'textarea', key: 'notes', label: 'Comments, damage, notes', required: false },
      ],
    },

    'protein-temp-check': {
      id: 'protein-temp-check',
      title: 'Protein Temp Check',
      category: 'food',
      sheetTab: 'Protein Temp Check',
      instructionTitle: 'End of day temperature log',
      instructions: [
        'At the end of the last meal of the day, take a clear photo of the whiteboard showing today\'s protein temperature log',
        'Upload the photo below and submit — that\'s it',
        'The date and time of your submission is automatically recorded',
      ],
      fields: [
        { type: 'date',  key: 'date',          label: 'Date', auto: true, required: true },
        { type: 'photo', key: 'temp_log_photo', label: 'Photo of temp check whiteboard', hint: 'Tap UPLOAD to capture the day\'s protein temp check log', required: true },
      ],
    },

  }, // end forms

};
