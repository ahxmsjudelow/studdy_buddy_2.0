export interface Subject {
  id: string;
  name: string;
  code?: string;
  stage: 'Y7-Y9' | 'Y10-Y13';
  category: 'Sciences' | 'Mathematics & Computing' | 'Languages & Literature' | 'Humanities & Social Sciences' | 'Business & Economics' | 'Creative & Vocational';
  popular?: boolean;
  topics: string[];
  keyFormulas?: string[];
  sampleQuestions: {
    question: string;
    marks: number;
    year?: string;
    difficulty: 'Standard' | 'Challenging' | 'Expert';
    solutionHint: string;
  }[];
}

export const SUBJECTS: Subject[] = [
  // Y7 - Y9
  {
    id: 'y7-math',
    name: 'Mathematics',
    stage: 'Y7-Y9',
    category: 'Mathematics & Computing',
    popular: true,
    topics: ['Algebraic Expressions & Equations', 'Ratio, Proportion & Rates', 'Geometry, Angles & Polygons', 'Fractions, Decimals & Percentages', 'Probability & Data Handling'],
    keyFormulas: ['Area of triangle = 1/2 * b * h', 'Circumference = 2 * π * r', 'Speed = Distance / Time'],
    sampleQuestions: [
      {
        question: 'Solve for x: 4(2x - 3) = 3x + 15',
        marks: 3,
        difficulty: 'Standard',
        solutionHint: 'Expand brackets: 8x - 12 = 3x + 15. Subtract 3x and add 12 to isolate x = 27/5 = 5.4.'
      },
      {
        question: 'A shop reduces the price of a bicycle by 15% to $170. Calculate the original price.',
        marks: 3,
        difficulty: 'Standard',
        solutionHint: 'The sale price represents 85% of original. Original = 170 / 0.85 = $200.'
      },
      {
        question: 'A bag contains 5 red, 7 blue, and 8 green marbles. If one marble is drawn at random, find the probability that it is NOT red.',
        marks: 2,
        difficulty: 'Standard',
        solutionHint: 'Total marbles = 20. Non-red = 15. P(Not Red) = 15/20 = 3/4 = 0.75.'
      },
      {
        question: 'Calculate the total surface area of a closed cylinder with radius 4 cm and height 10 cm. Give your answer to 3 significant figures.',
        marks: 4,
        difficulty: 'Challenging',
        solutionHint: 'Area = 2πr² + 2πrh = 2π(16) + 2π(4)(10) = 32π + 80π = 112π ≈ 352 cm².'
      }
    ]
  },
  {
    id: 'y7-eng',
    name: 'English',
    stage: 'Y7-Y9',
    category: 'Languages & Literature',
    popular: true,
    topics: ['Reading Comprehension & Inference', 'Descriptive & Narrative Writing', 'Figurative Language & Imagery', 'Poetry Analysis', 'Grammar & Rhetorical Devices'],
    sampleQuestions: [
      {
        question: 'Explain how the author uses sensory imagery in paragraph 2 to establish tension.',
        marks: 4,
        difficulty: 'Standard',
        solutionHint: 'Identify specific auditory or visual words and analyze their emotional connotations.'
      },
      {
        question: 'Rewrite this sentence in the active voice: "The ancient manuscript was carefully examined by the young scholar."',
        marks: 2,
        difficulty: 'Standard',
        solutionHint: 'Active voice: "The young scholar carefully examined the ancient manuscript."'
      },
      {
        question: 'Analyze the effect of the personification in the line: "The storm screamed through the shattered window frames."',
        marks: 3,
        difficulty: 'Challenging',
        solutionHint: 'Attributes intentional human ferocity to nature, creating visceral fear and vulnerability.'
      }
    ]
  },
  {
    id: 'y7-sci',
    name: 'Science',
    stage: 'Y7-Y9',
    category: 'Sciences',
    popular: true,
    topics: ['Cell Structure & Function', 'States of Matter & Particle Theory', 'Forces, Motion & Gravity', 'Photosynthesis & Plant Biology', 'Acids, Alkalis & Neutralization'],
    keyFormulas: ['Force = Mass * Acceleration (F = ma)', 'Density = Mass / Volume (ρ = m / V)'],
    sampleQuestions: [
      {
        question: 'Compare plant and animal cells, identifying three structures present only in plant cells.',
        marks: 3,
        difficulty: 'Standard',
        solutionHint: 'Cell wall, chloroplasts, and permanent large vacuole.'
      },
      {
        question: 'A solid metal cube of mass 270 g has side lengths of 3 cm. Calculate its density in g/cm³ and state whether it floats in water (density 1.0 g/cm³).',
        marks: 4,
        difficulty: 'Standard',
        solutionHint: 'Volume = 3³ = 27 cm³. Density = 270/27 = 10 g/cm³. Sinks because density > 1.0.'
      },
      {
        question: 'Explain using particle theory why gases can be easily compressed but liquids cannot.',
        marks: 3,
        difficulty: 'Standard',
        solutionHint: 'Gas particles are widely spaced with large empty gaps. Liquid particles are closely packed with negligible free space.'
      }
    ]
  },

  // Cambridge IGCSE Subjects (Full curriculum provided in prompt)
  {
    id: '0580',
    name: 'Mathematics',
    code: '0580',
    stage: 'Y10-Y13',
    category: 'Mathematics & Computing',
    popular: true,
    topics: ['Number & Accuracy', 'Algebra & Graphs', 'Coordinate Geometry', 'Geometry & Trigonometry', 'Vectors & Transformations', 'Probability & Statistics', 'Calculus (Differentiation)'],
    keyFormulas: ['Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)', 'Sine Rule: a/sin(A) = b/sin(B)', 'Cosine Rule: a² = b² + c² - 2bc*cos(A)'],
    sampleQuestions: [
      {
        question: 'Find the coordinates of the turning point on the curve y = 2x² - 12x + 7 and determine its nature.',
        marks: 4,
        year: '2024 P4',
        difficulty: 'Challenging',
        solutionHint: 'Differentiate dy/dx = 4x - 12 = 0 to find x=3, then calculate y = 2(9) - 36 + 7 = -11. d²y/dx² = 4 > 0 (minimum at (3, -11)).'
      },
      {
        question: 'A ship sails 15 km on a bearing of 040° and then 22 km on a bearing of 130°. Calculate the distance back to the starting point.',
        marks: 5,
        year: '2023 P2',
        difficulty: 'Challenging',
        solutionHint: 'Draw the triangle. The interior angle between the two legs is 90° (130° - 40° = 90°). Use Pythagoras or Cosine Rule: d = √(15² + 22²) = √(225 + 484) = √709 ≈ 26.6 km.'
      },
      {
        question: 'Solve the simultaneous equations: 3x + 2y = 19 and 2x - 5y = -19.',
        marks: 4,
        year: '2023 P4',
        difficulty: 'Standard',
        solutionHint: 'Multiply eqn 1 by 5 (15x + 10y = 95) and eqn 2 by 2 (4x - 10y = -38). Add: 19x = 57 -> x = 3. Substitute: 9 + 2y = 19 -> y = 5.'
      },
      {
        question: 'The volume of a sphere is given by V = (4/3)πr³. If the volume is 288π cm³, find the radius r and total surface area.',
        marks: 4,
        year: '2022 P2',
        difficulty: 'Standard',
        solutionHint: '(4/3)πr³ = 288π -> r³ = 288 * 3 / 4 = 216 -> r = 6 cm. Surface area = 4πr² = 4π(36) = 144π ≈ 452 cm².'
      },
      {
        question: 'Vector OA = (3, -4) and Vector OB = (7, 5). Find the unit vector in the direction of vector AB.',
        marks: 4,
        year: '2024 P4',
        difficulty: 'Expert',
        solutionHint: 'Vector AB = OB - OA = (7-3, 5 - (-4)) = (4, 9). Magnitude = √(16 + 81) = √97. Unit vector = 1/√97 (4, 9).'
      }
    ]
  },
  {
    id: '0606',
    name: 'Mathematics - Additional',
    code: '0606',
    stage: 'Y10-Y13',
    category: 'Mathematics & Computing',
    popular: true,
    topics: ['Functions & Quadratic Equations', 'Indices & Surds', 'Polynomials & Factor Theorem', 'Logarithmic & Exponential Functions', 'Binomial Expansions', 'Differentiation & Integration', 'Trigonometric Identities & Equations'],
    keyFormulas: ['∫ (ax + b)ⁿ dx = (ax+b)ⁿ⁺¹ / (a(n+1)) + c', 'Product Rule: d(uv)/dx = u dv/dx + v du/dx', 'Quotient Rule'],
    sampleQuestions: [
      {
        question: 'Evaluate the definite integral ∫[1 to 3] (4x³ - 6x + 5) dx.',
        marks: 4,
        year: '2024 P1',
        difficulty: 'Challenging',
        solutionHint: 'Integrate term by term to get [x⁴ - 3x² + 5x] evaluated from 1 to 3: (81 - 27 + 15) - (1 - 3 + 5) = 69 - 3 = 66.'
      },
      {
        question: 'Find the first 3 terms in descending powers of x in the binomial expansion of (2x - 3/x)⁶.',
        marks: 4,
        year: '2023 P2',
        difficulty: 'Challenging',
        solutionHint: 'Term 1 = (2x)⁶ = 64x⁶. Term 2 = 6*(2x)⁵*(-3/x) = 6*32x⁵*(-3/x) = -576x⁴. Term 3 = 15*(2x)⁴*(-3/x)² = 15*16x⁴*(9/x²) = 2160x².'
      },
      {
        question: 'Solve for x: log₂(x + 6) - log₂(x - 1) = 3.',
        marks: 4,
        year: '2024 P1',
        difficulty: 'Challenging',
        solutionHint: 'Combine logs: log₂((x+6)/(x-1)) = 3. Convert to exponential: (x+6)/(x-1) = 2³ = 8. x + 6 = 8x - 8 -> 7x = 14 -> x = 2.'
      }
    ]
  },
  {
    id: '0610',
    name: 'Biology',
    code: '0610',
    stage: 'Y10-Y13',
    category: 'Sciences',
    popular: true,
    topics: ['Characteristics and Classification of Living Organisms', 'Organization of the Organism', 'Movement in and out of Cells', 'Biological Molecules & Enzymes', 'Plant Nutrition & Human Nutrition', 'Transport in Plants & Animals', 'Respiration & Gas Exchange', 'Coordination & Response', 'Reproduction & Inheritance', 'Ecology & Human Influences'],
    keyFormulas: ['Magnification = Image Size / Actual Size (M = I / A)'],
    sampleQuestions: [
      {
        question: 'Explain how the structure of a root hair cell is adapted for its function.',
        marks: 3,
        year: '2023 P4',
        difficulty: 'Standard',
        solutionHint: 'Large surface area for water absorption via osmosis; thin cell wall; high mineral concentration for active transport.'
      },
      {
        question: 'Describe the effect of increasing temperature from 10°C to 60°C on enzyme activity.',
        marks: 5,
        year: '2024 P4',
        difficulty: 'Challenging',
        solutionHint: '10°C to ~40°C: Kinetic energy increases, more successful collisions, rate rises to optimum. Above 40°C: Denaturation occurs, active site shape changes permanently, substrate no longer binds, rate drops to zero.'
      },
      {
        question: 'Explain why pure water causes red blood cells to burst (lyse), while plant cells placed in pure water become turgid.',
        marks: 4,
        year: '2022 P3',
        difficulty: 'Standard',
        solutionHint: 'Water enters both via osmosis. Animal cells lack a cell wall so internal osmotic pressure causes lysis. Plant cells have rigid cellulose cell walls providing mechanical strength (turgor pressure).'
      },
      {
        question: 'Outline the roles of the hormone insulin in regulating blood glucose levels.',
        marks: 4,
        year: '2024 P2',
        difficulty: 'Standard',
        solutionHint: 'Secreted by beta cells in pancreas when blood glucose is elevated; stimulates liver and muscle cells to uptake glucose and convert it into glycogen.'
      }
    ]
  },
  {
    id: '0620',
    name: 'Chemistry',
    code: '0620',
    stage: 'Y10-Y13',
    category: 'Sciences',
    popular: true,
    topics: ['States of Matter', 'Atoms, Elements and Compounds', 'Stoichiometry & Mole Calculations', 'Electrochemistry', 'Chemical Energetics', 'Chemical Reactions & Rates', 'Acids, Bases and Salts', 'The Periodic Table', 'Metals & Reactivity', 'Organic Chemistry & Polymers'],
    keyFormulas: ['Moles = Mass / Molar Mass (n = m / M)', 'Moles = Concentration * Volume (n = C * V)', 'Gas Volume = Moles * 24 dm³ (at r.t.p.)'],
    sampleQuestions: [
      {
        question: 'Calculate the volume of carbon dioxide gas measured at r.t.p. produced when 10.0 g of calcium carbonate reacts completely with excess hydrochloric acid. [Ar: Ca=40, C=12, O=16]',
        marks: 4,
        year: '2024 P4',
        difficulty: 'Challenging',
        solutionHint: 'Mr(CaCO3) = 40 + 12 + 48 = 100 g/mol. Moles = 10.0 / 100 = 0.10 mol. Mole ratio CaCO3:CO2 is 1:1, so moles CO2 = 0.10 mol. Volume = 0.10 * 24 dm³ = 2.4 dm³ (2400 cm³).'
      },
      {
        question: 'Explain in terms of collision theory why increasing the concentration of hydrochloric acid increases the rate of reaction with magnesium.',
        marks: 3,
        year: '2023 P4',
        difficulty: 'Standard',
        solutionHint: 'Higher concentration means more reactant particles per unit volume; frequency of collisions between H+ ions and magnesium increases, resulting in more successful collisions per second.'
      },
      {
        question: 'Predict the products formed at the anode and cathode during the electrolysis of concentrated aqueous sodium chloride (brine). Write ionic half-equations.',
        marks: 5,
        year: '2024 P4',
        difficulty: 'Expert',
        solutionHint: 'Cathode: Hydrogen gas (2H⁺ + 2e⁻ -> H₂). Anode: Chlorine gas (2Cl⁻ -> Cl₂ + 2e⁻). Sodium and hydroxide ions remain in solution forming aqueous sodium hydroxide.'
      },
      {
        question: 'A compound contains 52.2% Carbon, 13.0% Hydrogen, and 34.8% Oxygen by mass. Determine its empirical formula. [Ar: C=12, H=1, O=16]',
        marks: 4,
        year: '2023 P2',
        difficulty: 'Standard',
        solutionHint: 'Moles: C = 52.2/12 = 4.35; H = 13.0/1 = 13.0; O = 34.8/16 = 2.175. Divide by smallest (2.175): C = 2, H = 6, O = 1. Empirical formula: C₂H₆O.'
      }
    ]
  },
  {
    id: '0625',
    name: 'Physics',
    code: '0625',
    stage: 'Y10-Y13',
    category: 'Sciences',
    popular: true,
    topics: ['Motion, Forces and Energy', 'Thermal Physics', 'Waves, Light & Sound', 'Electricity and Magnetism', 'Nuclear Physics', 'Space Physics (Astrophysics)'],
    keyFormulas: ['v = u + at', 'KE = 1/2 * m * v²', 'V = I * R', 'P = I * V', 'v = f * λ', 'n = sin(i) / sin(r)'],
    sampleQuestions: [
      {
        question: 'A 1200 kg car accelerates uniformly from rest to a speed of 25 m/s in 8.0 s. Calculate the resultant force acting on the car and the work done.',
        marks: 5,
        year: '2024 P4',
        difficulty: 'Challenging',
        solutionHint: 'a = (25-0)/8 = 3.125 m/s². Force = 1200 * 3.125 = 3750 N. Work done = Change in KE = 0.5 * 1200 * 25² = 375,000 J (375 kJ).'
      },
      {
        question: 'A light ray in air enters a glass block of refractive index 1.52 at an angle of incidence of 45°. Calculate the angle of refraction inside the glass.',
        marks: 3,
        year: '2023 P4',
        difficulty: 'Standard',
        solutionHint: 'n = sin(i) / sin(r) -> sin(r) = sin(45°) / 1.52 = 0.7071 / 1.52 ≈ 0.4652 -> r = arcsin(0.4652) ≈ 27.7°.'
      },
      {
        question: 'An electric kettle is rated at 2200 W and is connected to a 230 V mains supply. Calculate the current flowing and the energy consumed in 3.0 minutes.',
        marks: 4,
        year: '2024 P2',
        difficulty: 'Standard',
        solutionHint: 'I = P / V = 2200 / 230 ≈ 9.57 A. Time = 3 * 60 = 180 s. Energy = P * t = 2200 * 180 = 396,000 J (396 kJ).'
      },
      {
        question: 'Explain why a sound wave is described as a longitudinal wave and how compressions and rarefactions are formed.',
        marks: 4,
        year: '2022 P4',
        difficulty: 'Standard',
        solutionHint: 'Vibrations/oscillations of air particles are parallel to the direction of wave travel. Compressions are regions of high pressure where particles are close; rarefactions are regions of low pressure where particles are spread out.'
      }
    ]
  },
  {
    id: '0478',
    name: 'Computer Science',
    code: '0478',
    stage: 'Y10-Y13',
    category: 'Mathematics & Computing',
    popular: true,
    topics: ['Data Representation (Binary, Hexadecimal, Sound & Images)', 'Data Transmission & Error Checking', 'Hardware, CPU Architecture & Memory', 'Software & Operating Systems', 'The Internet and Cybersecurity', 'Algorithm Design & Problem-Solving', 'Programming Concepts & Databases'],
    keyFormulas: ['Bandwidth calculations', 'Two\'s complement representation', 'Logic gates truth tables: AND, OR, NOT, NAND, NOR, XOR'],
    sampleQuestions: [
      {
        question: 'Explain the purpose of the Program Counter (PC) and Memory Address Register (MAR) during the fetch-execute cycle.',
        marks: 4,
        year: '2023 P1',
        difficulty: 'Standard',
        solutionHint: 'PC holds the memory address of the next instruction to be fetched; this address is copied into the MAR via the internal address bus, then PC is incremented.'
      },
      {
        question: 'Convert the negative denary number -42 into an 8-bit Two\'s Complement binary representation.',
        marks: 3,
        year: '2024 P1',
        difficulty: 'Standard',
        solutionHint: '1) +42 in binary = 00101010. 2) Invert bits = 11010101. 3) Add 1 = 11010110. Check: -128 + 64 + 16 + 4 + 2 = -42.'
      },
      {
        question: 'Describe how a checksum is used to detect errors in transmitted network packets.',
        marks: 3,
        year: '2023 P1',
        difficulty: 'Standard',
        solutionHint: 'Sender calculates numerical checksum using a designated algorithm and appends it to data block. Receiver recalculates checksum on arrival. If values differ, an error occurred and retransmission is requested.'
      },
      {
        question: 'Draw the truth table for an XOR (Exclusive OR) logic gate with inputs A and B.',
        marks: 3,
        year: '2022 P1',
        difficulty: 'Standard',
        solutionHint: 'Inputs (A, B) -> Output: (0,0)->0, (0,1)->1, (1,0)->1, (1,1)->0. Output is 1 if and only if exactly one input is 1.'
      }
    ]
  },
  {
    id: '0450',
    name: 'Business Studies',
    code: '0450',
    stage: 'Y10-Y13',
    category: 'Business & Economics',
    popular: true,
    topics: ['Understanding Business Activity', 'People in Business & Motivation', 'Marketing Mix (4Ps)', 'Operations Management & Production', 'Financial Information & Decisions', 'External Influences on Business'],
    keyFormulas: ['Break-even point = Fixed Costs / (Selling Price - Variable Cost per unit)', 'Gross Profit Margin = (Gross Profit / Revenue) * 100%'],
    sampleQuestions: [
      {
        question: 'Evaluate whether a sole trader business should convert into a private limited company (Ltd) to fund expansion.',
        marks: 6,
        year: '2024 P2',
        difficulty: 'Challenging',
        solutionHint: 'Discuss limited liability and access to capital from selling shares to family/friends vs loss of full confidentiality, statutory accounts filing, and legal setup costs.'
      },
      {
        question: 'A manufacturing firm has fixed costs of $60,000 per month. Selling price is $50 per unit and variable cost is $20 per unit. Calculate the break-even output.',
        marks: 3,
        year: '2023 P1',
        difficulty: 'Standard',
        solutionHint: 'Unit contribution = 50 - 20 = $30. Break-even output = 60,000 / 30 = 2,000 units.'
      },
      {
        question: 'Analyze two benefits to a multinational company of using market penetration pricing when entering a new territory.',
        marks: 4,
        year: '2024 P2',
        difficulty: 'Standard',
        solutionHint: '1) Attracts price-sensitive consumers rapidly, building market share. 2) Discourages competitor entry through low profit margins.'
      }
    ]
  },
  {
    id: '0455',
    name: 'Economics',
    code: '0455',
    stage: 'Y10-Y13',
    category: 'Business & Economics',
    popular: true,
    topics: ['The Basic Economic Problem & Opportunity Cost', 'The Allocation of Resources & Price Elasticity', 'Microeconomic Decision Makers', 'Government and the Macroeconomy (Inflation, Employment, Growth)', 'Economic Development', 'International Trade & Globalization'],
    keyFormulas: ['PED = % change in quantity demanded / % change in price', 'Inflation rate = ((CPI Year 2 - CPI Year 1) / CPI Year 1) * 100%'],
    sampleQuestions: [
      {
        question: 'Discuss whether an increase in the rate of interest will reduce inflation in an economy.',
        marks: 8,
        year: '2024 P2',
        difficulty: 'Challenging',
        solutionHint: 'Analyze transmission mechanism: higher interest increases cost of borrowing, incentivizes saving, and dampens consumer spending (C) and investment (I), reducing aggregate demand (AD) and demand-pull inflation. Counter-argue: higher mortgage costs and import costs (if currency weakens) can cause cost-push pressures.'
      },
      {
        question: 'A 10% increase in the price of train tickets causes demand to fall by 4%. Calculate the Price Elasticity of Demand (PED) and state whether demand is elastic or inelastic.',
        marks: 3,
        year: '2023 P2',
        difficulty: 'Standard',
        solutionHint: 'PED = -4% / +10% = -0.4. Since |PED| < 1, demand is price INELASTIC.'
      },
      {
        question: 'Explain two reasons why market failure occurs in the provision of healthcare services.',
        marks: 4,
        year: '2024 P1',
        difficulty: 'Standard',
        solutionHint: '1) Positive externalities of consumption (e.g. vaccination protects society, leading to under-consumption in a free market). 2) Information asymmetry between doctors and patients.'
      }
    ]
  },
  {
    id: '0500',
    name: 'English - First Language',
    code: '0500',
    stage: 'Y10-Y13',
    category: 'Languages & Literature',
    popular: true,
    topics: ['Reading Comprehension & Synthesis', 'Directed Writing & Evaluation', 'Extended Response to Reading', 'Descriptive Composition', 'Narrative Composition'],
    sampleQuestions: [
      {
        question: 'Write a speech for your school council arguing for the implementation of self-directed study sessions.',
        marks: 25,
        year: '2024 P2',
        difficulty: 'Challenging',
        solutionHint: 'Adopt persuasive register, counter-arguments, rhetorical devices, and balanced structural flow.'
      },
      {
        question: 'In Text A, the writer describes their encounter with an Arctic glacier. Analyze how the writer uses language to create a sense of awe and danger.',
        marks: 15,
        year: '2023 P1',
        difficulty: 'Challenging',
        solutionHint: 'Select 3 precise quotations. Analyze connotation, juxtaposition of beauty vs lethal cold, and acoustic effects.'
      }
    ]
  },
  {
    id: '0460',
    name: 'Geography',
    code: '0460',
    stage: 'Y10-Y13',
    category: 'Humanities & Social Sciences',
    popular: true,
    topics: ['Population and Settlement', 'The Natural Environment (Rivers, Coasts, Earthquakes, Volcanoes)', 'Economic Development and Resource Use'],
    sampleQuestions: [
      {
        question: 'For a named river you have studied, explain the causes of flooding and evaluate the management strategies used.',
        marks: 7,
        year: '2023 P1',
        difficulty: 'Challenging',
        solutionHint: 'Use named case study (e.g., Ganges/Brahmaputra), differentiate physical vs human causes, assess hard vs soft engineering.'
      }
    ]
  },
  {
    id: '0470',
    name: 'History',
    code: '0470',
    stage: 'Y10-Y13',
    category: 'Humanities & Social Sciences',
    popular: true,
    topics: ['The 20th Century: International Relations since 1919', 'The League of Nations', 'The Collapse of Peace 1939', 'The Cold War & Cuban Missile Crisis', 'Depth Study: Germany 1918-1945'],
    sampleQuestions: [
      {
        question: '"The Treaty of Versailles was unfair to Germany." How far do you agree with this statement? Explain your answer.',
        marks: 10,
        year: '2024 P1',
        difficulty: 'Challenging',
        solutionHint: 'Examine both sides: territorial and reparations severity vs Germany\'s harsh Treaty of Brest-Litovsk and French security needs.'
      }
    ]
  },

  // Additional Cambridge IGCSE subjects from user list
  { id: '0452', name: 'Accounting', code: '0452', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['Double Entry Bookkeeping', 'Financial Statements', 'Ratio Analysis', 'Depreciation', 'Partnerships'], sampleQuestions: [] },
  { id: '0985', name: 'Accounting (9-1)', code: '0985', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['Accounting Principles', 'Trial Balance', 'Income Statement', 'Statement of Financial Position'], sampleQuestions: [] },
  { id: '0548', name: 'Afrikaans - Second Language', code: '0548', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Leesbegrip', 'Skryfvaardighede', 'Taalstrukture', 'Mondeling'], sampleQuestions: [] },
  { id: '0600', name: 'Agriculture', code: '0600', stage: 'Y10-Y13', category: 'Sciences', topics: ['Soil Management', 'Crop Husbandry', 'Livestock Husbandry', 'Farm Structures'], sampleQuestions: [] },
  { id: '0508', name: 'Arabic - First Language', code: '0508', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Reading Comprehension', 'Summary Writing', 'Argumentative Essay', 'Descriptive Essay'], sampleQuestions: [] },
  { id: '7184', name: 'Arabic - First Language (9-1)', code: '7184', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Fahm al-Nas', 'Insha', 'Balagha', 'Qawaid'], sampleQuestions: [] },
  { id: '0544', name: 'Arabic - Foreign Language', code: '0544', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Vocabulary', 'Conversational Arabic', 'Grammar', 'Cultural Topics'], sampleQuestions: [] },
  { id: '7180', name: 'Arabic (9-1) New', code: '7180', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Listening', 'Reading', 'Writing', 'Speaking'], sampleQuestions: [] },
  { id: '0400', name: 'Art & Design', code: '0400', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Observational Drawing', 'Media Exploration', 'Personal Response', 'Critical Studies'], sampleQuestions: [] },
  { id: '0989', name: 'Art & Design (9-1)', code: '0989', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Coursework Portfolio', 'Externally Set Assignment', 'Visual Research'], sampleQuestions: [] },
  { id: '0538', name: 'Bahasa Indonesia', code: '0538', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Pemahaman Membaca', 'Menulis Narasi', 'Eksposisi', 'Tata Bahasa'], sampleQuestions: [] },
  { id: '0970', name: 'Biology (9-1)', code: '0970', stage: 'Y10-Y13', category: 'Sciences', topics: ['Enzyme Action', 'Genetics', 'Homeostasis', 'Human Impact'], sampleQuestions: [] },
  { id: '0264', name: 'Business', code: '0264', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['Enterprise', 'Business Growth', 'Operations', 'Finance'], sampleQuestions: [] },
  { id: '0774', name: 'Business (9-1)', code: '0774', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['Market Research', 'Cash Flow', 'Business Ownership'], sampleQuestions: [] },
  { id: '0986', name: 'Business Studies (9-1)', code: '0986', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['Human Resources', 'Marketing Strategy', 'Global Markets'], sampleQuestions: [] },
  { id: '0971', name: 'Chemistry (9-1)', code: '0971', stage: 'Y10-Y13', category: 'Sciences', topics: ['Electrolysis', 'Acids and Bases', 'Equilibrium', 'Organic Mechanisms'], sampleQuestions: [] },
  { id: '0509', name: 'Chinese - First Language', code: '0509', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Reading Comprehension', 'Classical Chinese', 'Creative Writing'], sampleQuestions: [] },
  { id: '0523', name: 'Chinese - Second Language', code: '0523', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Reading', 'Listening', 'Writing', 'Speaking'], sampleQuestions: [] },
  { id: '0547', name: 'Chinese (Mandarin) - Foreign Language', code: '0547', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Pinyin', 'Character Recognition', 'Daily Dialogue', 'Written Composition'], sampleQuestions: [] },
  { id: '0715', name: 'Commerce New', code: '0715', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['Commercial Operations', 'Banking & Insurance', 'Advertising', 'Trade'], sampleQuestions: [] },
  { id: '0265', name: 'Computer Science New', code: '0265', stage: 'Y10-Y13', category: 'Mathematics & Computing', topics: ['Computational Thinking', 'Data Representation', 'Networks'], sampleQuestions: [] },
  { id: '0984', name: 'Computer Science (9-1)', code: '0984', stage: 'Y10-Y13', category: 'Mathematics & Computing', topics: ['Architecture', 'Logic Gates', 'Pseudocode', 'Python Programming'], sampleQuestions: [] },
  { id: '0445', name: 'Design & Technology', code: '0445', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Resistant Materials', 'Systems & Control', 'Graphic Products'], sampleQuestions: [] },
  { id: '0979', name: 'Design & Technology (9-1)', code: '0979', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Design Process', 'CAD/CAM', 'Ergonomics'], sampleQuestions: [] },
  { id: '0411', name: 'Drama', code: '0411', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Text Interpretation', 'Original Devised Work', 'Performance Techniques'], sampleQuestions: [] },
  { id: '0994', name: 'Drama (9-1)', code: '0994', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Stagecraft', 'Characterization', 'Scriptwriting'], sampleQuestions: [] },
  { id: '0987', name: 'Economics (9-1)', code: '0987', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['Fiscal Policy', 'Monetary Policy', 'Supply-Side Policies', 'Exchange Rates'], sampleQuestions: [] },
  { id: '0990', name: 'English - First Language (9-1)', code: '0990', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Text Analysis', 'Argumentative Writing', 'Summary Skills'], sampleQuestions: [] },
  { id: '0524', name: 'English - First Language (US)', code: '0524', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Rhetorical Analysis', 'Informative Writing', 'Narrative Craft'], sampleQuestions: [] },
  { id: '0475', name: 'English – Literature in English', code: '0475', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Shakespearean Drama', 'Prose Analysis', 'Poetry Exploration', 'Unseen Texts'], sampleQuestions: [] },
  { id: '0992', name: 'English – Literature in English (9-1)', code: '0992', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Character Development', 'Themes & Context', 'Dramatic Irony'], sampleQuestions: [] },
  { id: '0472', name: 'English (as an Additional Language) New', code: '0472', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Listening Skills', 'Reading Comprehension', 'Directed Writing'], sampleQuestions: [] },
  { id: '0772', name: 'English (as an Additional Language) (9-1) New', code: '0772', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Language Structures', 'Academic Vocabulary', 'Speaking Fluency'], sampleQuestions: [] },
  { id: '0465', name: 'English (Core) as a Second Language (Egypt)', code: '0465', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Note-making', 'Summary', 'Formal Letter Writing'], sampleQuestions: [] },
  { id: '0511', name: 'English as a Second Language (Count-in speaking)', code: '0511', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Oral Conversation', 'Listening Comprehension', 'Article Writing'], sampleQuestions: [] },
  { id: '0991', name: 'English as a Second Language (Count-in Speaking) (9-1)', code: '0991', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Interactive Discussion', 'Reading for Detail', 'Informal Email'], sampleQuestions: [] },
  { id: '0510', name: 'English as a Second Language (Speaking endorsement)', code: '0510', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Speaking Endorsement', 'Reading Interpretation', 'Written Expression'], sampleQuestions: [] },
  { id: '0993', name: 'English as a Second Language (Speaking Endorsement) (9-1)', code: '0993', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Pronunciation & Fluency', 'Auditory Processing', 'Grammar'], sampleQuestions: [] },
  { id: '0454', name: 'Enterprise', code: '0454', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['Identifying Business Opportunities', 'Action Planning', 'Risk Assessment', 'Evaluation of Project'], sampleQuestions: [] },
  { id: '0680', name: 'Environmental Management', code: '0680', stage: 'Y10-Y13', category: 'Sciences', topics: ['Rocks and Minerals', 'Energy and the Environment', 'Water and its Management', 'Oceans and Fisheries', 'Atmosphere and Human Influence'], sampleQuestions: [] },
  { id: '0648', name: 'Food & Nutrition', code: '0648', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Nutrients & Health', 'Meal Planning', 'Food Preservation', 'Cooking Science'], sampleQuestions: [] },
  { id: '0501', name: 'French - First Language', code: '0501', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Compréhension écrite', 'Expression écrite', 'Grammaire et style'], sampleQuestions: [] },
  { id: '0520', name: 'French - Foreign Language', code: '0520', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Everyday Activities', 'Personal Life', 'World of Work', 'International World'], sampleQuestions: [] },
  { id: '7156', name: 'French (9-1)', code: '7156', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Écoute', 'Lecture', 'Expression orale', 'Rédaction'], sampleQuestions: [] },
  { id: '0976', name: 'Geography (9-1)', code: '0976', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['Plate Tectonics', 'Weather & Climate', 'Industrial Growth', 'Urbanization'], sampleQuestions: [] },
  { id: '0505', name: 'German - First Language', code: '0505', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Textverständnis', 'Aufsatz', 'Sprachanalyse'], sampleQuestions: [] },
  { id: '0525', name: 'German - Foreign Language', code: '0525', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Hörverstehen', 'Leseverstehen', 'Schreiben', 'Sprechen'], sampleQuestions: [] },
  { id: '7159', name: 'German (9-1)', code: '7159', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Alltagssituationen', 'Kulturelle Themen', 'Grammatik'], sampleQuestions: [] },
  { id: '0457', name: 'Global Perspectives', code: '0457', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['Critical Thinking & Evaluation', 'Individual Report', 'Team Project', 'Global Issues (Climate, Inequality, Tech)'], sampleQuestions: [] },
  { id: '0549', name: 'Hindi as a Second Language', code: '0549', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Vyakaran', 'Patra Lekhan', 'Nibandh', 'Gadya & Padya'], sampleQuestions: [] },
  { id: '0409', name: 'History - American (US)', code: '0409', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['The Civil War & Reconstruction', 'Westward Expansion', 'Industrial America', 'The New Deal'], sampleQuestions: [] },
  { id: '0977', name: 'History (9-1)', code: '0977', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['The Interwar Years', 'Russian Revolution & Stalin', 'Cold War Crises'], sampleQuestions: [] },
  { id: '0417', name: 'Information and Communication Technology', code: '0417', stage: 'Y10-Y13', category: 'Mathematics & Computing', topics: ['Hardware and Software', 'Networks and the Internet', 'Document Production', 'Databases & Access', 'Spreadsheets & Excel Formulas', 'Web Authoring (HTML/CSS)'], sampleQuestions: [] },
  { id: '0983', name: 'Information and Communication Technology (9-1)', code: '0983', stage: 'Y10-Y13', category: 'Mathematics & Computing', topics: ['ICT Applications', 'System Life Cycle', 'Data Processing', 'Security'], sampleQuestions: [] },
  { id: '0531', name: 'IsiZulu as a Second Language', code: '0531', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Ukufunda nokuqonda', 'Ukubhala indaba', 'Uhlelo lolimi'], sampleQuestions: [] },
  { id: '0493', name: 'Islamiyat', code: '0493', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['Major Themes of Quran', 'History & Importance of Quran', 'Life of Prophet Muhammad (PBUH)', 'The Rightly Guided Caliphs', 'Articles of Faith & Pillars of Islam'], sampleQuestions: [] },
  { id: '0535', name: 'Italian - Foreign Language', code: '0535', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Ascolto', 'Lettura', 'Scrittura', 'Conversazione'], sampleQuestions: [] },
  { id: '7164', name: 'Italian (9-1)', code: '7164', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Grammatica', 'Lessico', 'Produzione scritta'], sampleQuestions: [] },
  { id: '0716', name: 'Japanese - Foreign Language New', code: '0716', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Hiragana & Katakana', 'Basic Kanji', 'Sentence Patterns', 'Cultural Communication'], sampleQuestions: [] },
  { id: '0480', name: 'Latin', code: '0480', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Translation into English', 'Latin Grammar & Syntax', 'Set Texts (Virgil, Cicero)'], sampleQuestions: [] },
  { id: '0696', name: 'Malay - First Language', code: '0696', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Kefahaman', 'Karangan', 'Tatabahasa', 'Peribahasa'], sampleQuestions: [] },
  { id: '0546', name: 'Malay - Foreign Language', code: '0546', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Kosa Kata', 'Mendengar', 'Membaca', 'Bertutur'], sampleQuestions: [] },
  { id: '0697', name: 'Marine Science New', code: '0697', stage: 'Y10-Y13', category: 'Sciences', topics: ['The Earth and Oceans', 'Marine Ecosystems & Biodiversity', 'Energetics of Marine Organisms', 'Human Impact and Marine Conservation'], sampleQuestions: [] },
  { id: '0607', name: 'Mathematics - International', code: '0607', stage: 'Y10-Y13', category: 'Mathematics & Computing', topics: ['Graphic Display Calculator (GDC) Skills', 'Functions & Modeling', 'Investigation and Modeling'], sampleQuestions: [] },
  { id: '0980', name: 'Mathematics (9-1)', code: '0980', stage: 'Y10-Y13', category: 'Mathematics & Computing', topics: ['Higher Number Theory', 'Algebraic Manipulation', 'Advanced Geometry', 'Statistics'], sampleQuestions: [] },
  { id: '0444', name: 'Mathematics (US)', code: '0444', stage: 'Y10-Y13', category: 'Mathematics & Computing', topics: ['Algebra I & II', 'Coordinate Geometry', 'Trigonometry', 'Probability'], sampleQuestions: [] },
  { id: '0410', name: 'Music', code: '0410', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Listening & Score Reading', 'World Music Traditions', 'Performing', 'Composing'], sampleQuestions: [] },
  { id: '0978', name: 'Music (9-1)', code: '0978', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Aural Perception', 'Harmony & Texture', 'Compositional Techniques'], sampleQuestions: [] },
  { id: '0448', name: 'Pakistan Studies', code: '0448', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['History and Culture of Pakistan', 'The Environment of Pakistan', 'Economic Development'], sampleQuestions: [] },
  { id: '0413', name: 'Physical Education', code: '0413', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Anatomy and Physiology', 'Skill Acquisition & Psychology', 'Social and Cultural Influences', 'Practical Performance'], sampleQuestions: [] },
  { id: '0995', name: 'Physical Education (9-1)', code: '0995', stage: 'Y10-Y13', category: 'Creative & Vocational', topics: ['Biomechanical Principles', 'Training Methods', 'Sports Performance'], sampleQuestions: [] },
  { id: '0652', name: 'Physical Science', code: '0652', stage: 'Y10-Y13', category: 'Sciences', topics: ['Atomic Physics', 'Chemical Stoichiometry', 'Mechanics', 'Waves and Electricity'], sampleQuestions: [] },
  { id: '0972', name: 'Physics (9-1)', code: '0972', stage: 'Y10-Y13', category: 'Sciences', topics: ['Astrophysics', 'Nuclear Radiation', 'Electromagnetism', 'Thermal Properties'], sampleQuestions: [] },
  { id: '0504', name: 'Portuguese - First Language', code: '0504', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Compreensão de Texto', 'Redação', 'Sintaxe e Morfologia'], sampleQuestions: [] },
  { id: '0266', name: 'Psychology New', code: '0266', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['Biological Foundations', 'Cognitive Psychology', 'Social Behavior', 'Developmental Milestones'], sampleQuestions: [] },
  { id: '0490', name: 'Religious Studies', code: '0490', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['Christianity, Islam, Judaism', 'Worship and Sacred Places', 'Religious Festivals', 'Moral Questions'], sampleQuestions: [] },
  { id: '0499', name: 'Sanskrit', code: '0499', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Devanagari Script', 'Sandhi Rules', 'Subhashitani & Epic Verse', 'Translation'], sampleQuestions: [] },
  { id: '0653', name: 'Science - Combined', code: '0653', stage: 'Y10-Y13', category: 'Sciences', topics: ['Key Biology Concepts', 'Core Chemistry Concepts', 'Fundamental Physics Concepts'], sampleQuestions: [] },
  { id: '0973', name: 'Sciences - Co-ordinated (9-1)', code: '0973', stage: 'Y10-Y13', category: 'Sciences', topics: ['Double Award Science', 'Experimental Skills', 'Integrated Scientific Investigations'], sampleQuestions: [] },
  { id: '0654', name: 'Sciences - Co-ordinated (Double)', code: '0654', stage: 'Y10-Y13', category: 'Sciences', topics: ['Biology Core & Extended', 'Chemistry Core & Extended', 'Physics Core & Extended'], sampleQuestions: [] },
  { id: '0698', name: 'Setswana - First Language', code: '0698', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Tshekatsheko ya dikwalo', 'Tlhamo', 'Thutapuo'], sampleQuestions: [] },
  { id: '0495', name: 'Sociology', code: '0495', stage: 'Y10-Y13', category: 'Humanities & Social Sciences', topics: ['Theory and Methods', 'Culture, Identity and Socialization', 'Social Inequality', 'Family, Education & Crime'], sampleQuestions: [] },
  { id: '0502', name: 'Spanish - First Language', code: '0502', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Comprensión Lectora', 'Expresión Escrita', 'Gramática Avanzada'], sampleQuestions: [] },
  { id: '0530', name: 'Spanish - Foreign Language', code: '0530', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Comprensión Auditiva', 'Lectura y Redacción', 'Conversación Cotidiana'], sampleQuestions: [] },
  { id: '0474', name: 'Spanish - Literature in Spanish', code: '0474', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Análisis Literario', 'Obras de Teatro', 'Poesía Hispanoamericana'], sampleQuestions: [] },
  { id: '7160', name: 'Spanish (9-1)', code: '7160', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Destrezas Lingüísticas', 'Cultura Hispana', 'Ensayos'], sampleQuestions: [] },
  { id: '0479', name: 'Statistics New', code: '0479', stage: 'Y10-Y13', category: 'Mathematics & Computing', topics: ['Data Collection & Sampling', 'Measures of Central Tendency', 'Probability Distributions', 'Correlation & Regression'], sampleQuestions: [] },
  { id: '0262', name: 'Swahili', code: '0262', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Ufahamu', 'Insha', 'Sarufi na Matumizi ya Lugha'], sampleQuestions: [] },
  { id: '0518', name: 'Thai - First Language', code: '0518', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Reading Comprehension', 'Creative Writing', 'Thai Grammar & Idioms'], sampleQuestions: [] },
  { id: '0471', name: 'Travel & Tourism', code: '0471', stage: 'Y10-Y13', category: 'Business & Economics', topics: ['The Travel and Tourism Industry', 'Features of Worldwide Destinations', 'Customer Service & Marketing'], sampleQuestions: [] },
  { id: '0513', name: 'Turkish - First Language', code: '0513', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Metin İnceleme', 'Kompozisyon Yazma', 'Dilbilgisi ve Anlatım Bozuklukları'], sampleQuestions: [] },
  { id: '0539', name: 'Urdu as a Second Language', code: '0539', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Tafheem', 'Mazmoon Nigari', 'Qawaid', 'Mukaalma'], sampleQuestions: [] },
  { id: '0695', name: 'Vietnamese - First Language New', code: '0695', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Đọc hiểu', 'Làm văn nghị luận', 'Ngữ pháp tiếng Việt'], sampleQuestions: [] },
  { id: '0408', name: 'World Literature', code: '0408', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['Portfolio of Written Work', 'Unseen Poetry and Prose', 'Set Texts from Around the Globe'], sampleQuestions: [] },
  { id: '0545', name: 'Zulu - Second Language', code: '0545', stage: 'Y10-Y13', category: 'Languages & Literature', topics: ['IsiZulu Vocabulary', 'Comprehension', 'Grammar'], sampleQuestions: [] },
];
