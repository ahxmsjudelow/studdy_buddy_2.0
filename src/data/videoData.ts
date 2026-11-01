export interface VideoMasterclass {
  id: string;
  subjectId: string;
  subjectName: string;
  code?: string;
  title: string;
  topic: string;
  duration: string;
  lecturer: string;
  thumbnail: string;
  description: string;
  videoUrl: string; // playable sample stream / demo embed
  timestamps: { time: string; label: string; concept: string }[];
  keyFormulas: string[];
  sampleExamTraps: string[];
}

export const VIDEO_MASTERCLASSES: VideoMasterclass[] = [
  {
    id: 'vid-math-calc',
    subjectId: '0580',
    subjectName: 'Mathematics',
    code: '0580',
    title: 'Cambridge 0580: Differentiation, Tangents & Max/Min Turning Points',
    topic: 'Calculus (Differentiation)',
    duration: '14:35',
    lecturer: 'Cambridge Chief Examiner Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
    description: 'Learn the power rule d/dx(x^n) = nx^(n-1), how to set dy/dx = 0 to locate local maxima and minima, and verify nature using the second derivative d²y/dx².',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    timestamps: [
      { time: '00:45', label: 'First Principles of Gradients', concept: 'Instantaneous rate of change as limit of secant line' },
      { time: '03:20', label: 'Power Rule and Polynomial Differentiation', concept: 'd/dx(ax^n) = n*a*x^(n-1)' },
      { time: '07:15', label: 'Setting dy/dx = 0 for Turning Points', concept: 'Stationary points condition and coordinate calculation' },
      { time: '11:00', label: 'Second Derivative Nature Test', concept: 'd²y/dx² > 0 for minimum, < 0 for maximum' },
    ],
    keyFormulas: ['dy/dx = nx^(n-1)', 'Turning Point: dy/dx = 0', 'd²y/dx² > 0 (Min)'],
    sampleExamTraps: ['Forgetting to substitute x back into original y equation to find y-coordinate', 'Mixing up the signs for second derivative test'],
  },
  {
    id: 'vid-phys-mech',
    subjectId: '0625',
    subjectName: 'Physics',
    code: '0625',
    title: 'Physics 0625: Newton\'s Laws, Free Body Diagrams & Kinematics',
    topic: 'Motion, Forces and Energy',
    duration: '16:50',
    lecturer: 'Cambridge Senior Physics Educator',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1000&q=80',
    description: 'Full breakdown of v-t graphs, calculating acceleration from slope, finding distance from area, and applying F = ma with frictional resistances.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    timestamps: [
      { time: '01:10', label: 'Interpreting Velocity-Time Graphs', concept: 'Gradient = acceleration, Area = displacement' },
      { time: '05:30', label: 'Resolving Forces & Free Body Diagrams', concept: 'Equilibrium vs Resultant Accelerating Force' },
      { time: '10:15', label: 'Work, Kinetic Energy & Conservation', concept: 'W = F*d, KE = 1/2*m*v², GPE = m*g*h' },
      { time: '14:20', label: 'Cambridge Past Paper 2024 Walkthrough', concept: 'Multi-part car braking distance analysis' },
    ],
    keyFormulas: ['a = (v - u)/t', 'F = ma', 'KE = 1/2 m v²', 'W = F d'],
    sampleExamTraps: ['Using speed instead of velocity when direction changes', 'Forgetting to convert minutes or kilometers to SI units (seconds, meters)'],
  },
  {
    id: 'vid-chem-stoich',
    subjectId: '0620',
    subjectName: 'Chemistry',
    code: '0620',
    title: 'Chemistry 0620: Mastering The Mole, Titration Calculations & Gas Volumes',
    topic: 'Stoichiometry & Mole Calculations',
    duration: '18:15',
    lecturer: 'Cambridge Chemistry Lead Specialist',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    description: 'Never drop marks on stoichiometry. Master molar mass calculations, empirical formulas, limiting reagents, and acid-base titration concentrations.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    timestamps: [
      { time: '01:00', label: 'The Mole Concept and Avogadro Constant', concept: 'n = mass / Mr' },
      { time: '04:45', label: 'Solution Molarity (n = C x V)', concept: 'Converting cm³ to dm³ by dividing by 1000' },
      { time: '09:20', label: 'Gas Volumes at r.t.p. (24 dm³ rule)', concept: 'Volume = moles x 24 dm³' },
      { time: '14:05', label: 'Acid-Base Titration Step-by-Step Drill', concept: 'Concordant titres and stoichiometric ratios' },
    ],
    keyFormulas: ['n = m / Mr', 'C = n / V (dm³)', 'V_gas = n x 24 dm³', '% yield = (actual / theoretical) x 100'],
    sampleExamTraps: ['Forgetting to divide volume in cm³ by 1000 to get dm³', 'Neglecting mole ratio coefficients from the balanced equation'],
  },
  {
    id: 'vid-bio-cells',
    subjectId: '0610',
    subjectName: 'Biology',
    code: '0610',
    title: 'Biology 0610: Osmosis, Active Transport & Enzyme Kinetics',
    topic: 'Movement in and out of Cells',
    duration: '15:40',
    lecturer: 'Cambridge Biological Sciences Faculty',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1000&q=80',
    description: 'Visual microscopic footage explaining water potential gradients, turgor pressure in plant cells, and how temperature/pH alter enzyme active sites.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    timestamps: [
      { time: '00:50', label: 'Osmosis & Water Potential Gradients', concept: 'Net movement through partially permeable membrane' },
      { time: '05:15', label: 'Plasmolysis vs Turgidity in Plant Cells', concept: 'Cell wall structural support preventing lysis' },
      { time: '09:30', label: 'Active Transport Mechanism', concept: 'Carrier proteins and ATP moving substances against gradient' },
      { time: '13:00', label: 'Enzyme Lock & Key vs Induced Fit', concept: 'Denaturation kinetics above optimum temperature' },
    ],
    keyFormulas: ['Magnification = Image / Actual (I = A x M)'],
    sampleExamTraps: ['Saying water moves from "low to high concentration" instead of "higher to lower water potential"', 'Saying enzymes are "killed" instead of "denatured"'],
  },
  {
    id: 'vid-cs-arch',
    subjectId: '0478',
    subjectName: 'Computer Science',
    code: '0478',
    title: 'Computer Science 0478: The Von Neumann Architecture & Logic Gates',
    topic: 'Hardware, CPU Architecture & Memory',
    duration: '17:05',
    lecturer: 'Cambridge Computing Tripos Lecturer',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    description: 'Animated register-level walk through the Fetch-Decode-Execute cycle: PC, MAR, MDR, CIR, and ALU, followed by truth table logic gate circuits.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    timestamps: [
      { time: '01:20', label: 'Von Neumann Architecture Structure', concept: 'Shared memory for data and instructions' },
      { time: '06:00', label: 'The F-D-E Cycle Step-by-Step', concept: 'PC -> MAR -> Address Bus -> RAM -> Data Bus -> MDR -> CIR' },
      { time: '11:15', label: 'Logic Gates: XOR, NAND, NOR', concept: 'Truth tables and Boolean expressions' },
      { time: '15:10', label: 'Exam Technique for Architecture Questions', concept: 'Keywords for maximum Cambridge marks' },
    ],
    keyFormulas: ['Buses: Address (unidirectional), Data & Control (bidirectional)'],
    sampleExamTraps: ['Confusing the MAR (holds address) with MDR (holds data/instruction)', 'Writing that the PC executes the instruction (it only holds next address)'],
  },
  {
    id: 'vid-econ-elasticity',
    subjectId: '0455',
    subjectName: 'Economics',
    code: '0455',
    title: 'Economics 0455: Price Elasticity of Demand & Supply Equilibrium',
    topic: 'Price Elasticity & Resource Allocation',
    duration: '13:50',
    lecturer: 'Cambridge Economics Examiner',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
    description: 'Master Cambridge diagram technique: drawing supply and demand shifts, calculating PED, and explaining effects of indirect taxes and subsidies.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    timestamps: [
      { time: '00:40', label: 'Demand & Supply Equilibrium Curves', concept: 'Market clearing price and shortages/surpluses' },
      { time: '04:15', label: 'Calculating PED and Interpreting Coefficients', concept: '|PED| > 1 elastic, < 1 inelastic, = 0 perfectly inelastic' },
      { time: '08:30', label: 'Total Revenue Rule & Price Changes', concept: 'If elastic: price cut increases total revenue' },
      { time: '11:45', label: 'Government Interventions: Taxes & Subsidies', concept: 'Tax incidence between consumer and producer' },
    ],
    keyFormulas: ['PED = %ΔQD / %ΔP', 'PES = %ΔQS / %ΔP', 'Total Revenue = Price x Quantity'],
    sampleExamTraps: ['Drawing supply curve downward sloping (Demand is Downward, Supply Slopes Up)', 'Confusing a change in quantity demanded (movement along) with change in demand (shift)'],
  },
];
