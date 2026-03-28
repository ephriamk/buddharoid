// ═══════════════════════════════════════════════════════════════════
// BUDDHAROID — Comprehensive Buddhist Wisdom Dataset
// A curated collection of teachings, sutras, koans, and practices
// for the spiritual awakening of all sentient beings.
// ═══════════════════════════════════════════════════════════════════

// ─── CORE TEACHINGS ─────────────────────────────────────────────

export const CORE_TEACHINGS = [
  {
    id: 'four-noble-truths',
    category: 'core-teaching',
    title: 'The Four Noble Truths',
    source: 'Dhammacakkappavattana Sutta (SN 56.11)',
    tradition: 'All Buddhist',
    text: `1. Dukkha (Suffering): Birth is suffering, aging is suffering, illness is suffering, death is suffering. Union with what is displeasing is suffering. Separation from what is pleasing is suffering. Not to get what one wants is suffering.

2. Samudaya (Origin): It is craving that leads to renewed existence, accompanied by delight and lust — craving for sensual pleasures, craving for existence, craving for extermination.

3. Nirodha (Cessation): The remainderless fading away and cessation of that same craving, the giving up and relinquishing of it, freedom from it, nonattachment.

4. Magga (Path): The Noble Eightfold Path — right view, right intention, right speech, right action, right livelihood, right effort, right mindfulness, right concentration.`,
    teaching: 'The foundational framework of all Buddhist practice. The Buddha\'s first teaching after enlightenment, delivered at the Deer Park in Sarnath.',
    keywords: ['suffering', 'dukkha', 'craving', 'path', 'noble truths', 'foundation'],
  },
  {
    id: 'eightfold-path',
    category: 'core-teaching',
    title: 'The Noble Eightfold Path',
    source: 'Saccavibhanga Sutta (MN 141)',
    tradition: 'All Buddhist',
    text: `WISDOM (Prajna):
1. Right View (Samma Ditthi): Understanding the Four Noble Truths, karma, and the nature of reality.
2. Right Intention (Samma Sankappa): Intentions of renunciation, goodwill, and harmlessness.

ETHICS (Sila):
3. Right Speech (Samma Vaca): Abstaining from false speech, divisive speech, harsh speech, and idle chatter.
4. Right Action (Samma Kammanta): Abstaining from killing, stealing, and sexual misconduct.
5. Right Livelihood (Samma Ajiva): Earning a living in a way that does not cause harm.

CONCENTRATION (Samadhi):
6. Right Effort (Samma Vayama): Preventing unwholesome states, abandoning unwholesome states, developing wholesome states, maintaining wholesome states.
7. Right Mindfulness (Samma Sati): Contemplation of body, feelings, mind, and mental phenomena.
8. Right Concentration (Samma Samadhi): Development of the four jhanas (meditative absorptions).`,
    teaching: 'The middle way between self-indulgence and self-mortification. Not a linear path but an integrated practice where all eight factors support each other.',
    keywords: ['eightfold path', 'right view', 'right action', 'ethics', 'wisdom', 'concentration', 'middle way'],
  },
  {
    id: 'three-marks',
    category: 'core-teaching',
    title: 'The Three Marks of Existence (Tilakkhana)',
    source: 'Various Suttas',
    tradition: 'All Buddhist',
    text: `1. Anicca (Impermanence): All conditioned phenomena are impermanent. Everything that arises will also cease. Nothing in the conditioned world stays the same for even two consecutive moments.

2. Dukkha (Unsatisfactoriness): All conditioned phenomena are ultimately unsatisfying. Because everything changes, nothing can provide lasting fulfillment. This is not pessimism but a clear-eyed observation.

3. Anatta (Non-Self): All phenomena are without a permanent, unchanging self or soul. What we call "self" is a constantly changing process of five aggregates — not a fixed entity.`,
    teaching: 'Understanding these three characteristics through direct experience is the key to liberation. They are not beliefs to accept but truths to investigate.',
    keywords: ['impermanence', 'anicca', 'dukkha', 'anatta', 'non-self', 'three marks', 'characteristics'],
  },
  {
    id: 'dependent-origination',
    category: 'core-teaching',
    title: 'Dependent Origination (Paticca Samuppada)',
    source: 'Mahanidana Sutta (DN 15)',
    tradition: 'All Buddhist',
    text: `The twelve links of dependent origination:
1. Ignorance (Avijja) conditions Volitional Formations
2. Volitional Formations (Sankhara) condition Consciousness
3. Consciousness (Vinnana) conditions Name-and-Form
4. Name-and-Form (Namarupa) conditions the Six Sense Bases
5. Six Sense Bases (Salayatana) condition Contact
6. Contact (Phassa) conditions Feeling
7. Feeling (Vedana) conditions Craving
8. Craving (Tanha) conditions Clinging
9. Clinging (Upadana) conditions Becoming
10. Becoming (Bhava) conditions Birth
11. Birth (Jati) conditions Aging and Death
12. Aging and Death (Jaramarana)

"When this exists, that comes to be. With the arising of this, that arises. When this does not exist, that does not come to be. With the cessation of this, that ceases."`,
    teaching: 'Nothing exists independently. Everything arises in dependence on conditions. Understanding this chain reveals how suffering arises and how it can cease.',
    keywords: ['dependent origination', 'paticca samuppada', 'causation', 'twelve links', 'interdependence'],
  },
  {
    id: 'five-aggregates',
    category: 'core-teaching',
    title: 'The Five Aggregates (Khandhas)',
    source: 'Khandha Sutta (SN 22.48)',
    tradition: 'All Buddhist',
    text: `What we call a "person" is a constantly changing process of five aggregates:

1. Form (Rupa): The physical body and material elements — earth, water, fire, air.
2. Feeling (Vedana): The quality of pleasant, unpleasant, or neutral that accompanies every experience.
3. Perception (Sanna): Recognition and labeling of objects — "this is a flower," "that is blue."
4. Mental Formations (Sankhara): Volition, attention, intention, and all other mental factors — the active, constructing aspect of mind.
5. Consciousness (Vinnana): Awareness of objects through the six sense doors (eye, ear, nose, tongue, body, mind).

None of these aggregates is self. They arise and pass away continuously.`,
    teaching: 'By examining experience through the lens of the five aggregates, we see that there is no fixed "I" — only a dynamic process. This insight loosens the grip of self-grasping.',
    keywords: ['aggregates', 'khandhas', 'form', 'feeling', 'perception', 'consciousness', 'self', 'anatta'],
  },
  {
    id: 'four-immeasurables',
    category: 'core-teaching',
    title: 'The Four Immeasurables (Brahmaviharas)',
    source: 'Metta Sutta & Various',
    tradition: 'All Buddhist',
    text: `1. Loving-Kindness (Metta): The wish for all beings to be happy. Not sentimental love, but a steady, unconditional goodwill.

2. Compassion (Karuna): The wish for all beings to be free from suffering. The heart that trembles in the face of suffering and wishes to alleviate it.

3. Sympathetic Joy (Mudita): Rejoicing in the happiness and success of others. The antidote to jealousy and envy.

4. Equanimity (Upekkha): A balanced, even-minded awareness that is not swayed by attachment or aversion. Not indifference, but a deep wisdom that sees the bigger picture.

The traditional aspiration: "May all beings be happy. May all beings be free from suffering. May all beings find joy. May all beings rest in equanimity."`,
    teaching: 'These four qualities are called "immeasurable" because when fully developed, they extend to all beings without limit. They are both meditation practices and ways of being.',
    keywords: ['loving-kindness', 'metta', 'compassion', 'karuna', 'joy', 'mudita', 'equanimity', 'upekkha', 'brahmaviharas'],
  },
  {
    id: 'five-precepts',
    category: 'core-teaching',
    title: 'The Five Precepts (Panca Sila)',
    source: 'Various Suttas',
    tradition: 'All Buddhist',
    text: `The five training rules for ethical conduct:

1. I undertake the training rule to abstain from taking life.
2. I undertake the training rule to abstain from taking what is not given.
3. I undertake the training rule to abstain from sexual misconduct.
4. I undertake the training rule to abstain from false speech.
5. I undertake the training rule to abstain from intoxicants that cause heedlessness.

These are not commandments imposed from outside, but voluntary commitments undertaken with the understanding that these actions cause suffering for oneself and others.`,
    teaching: 'The precepts are the foundation of Buddhist practice. They create the conditions of non-harming that allow the mind to settle into meditation and wisdom to arise.',
    keywords: ['precepts', 'sila', 'ethics', 'morality', 'conduct', 'five precepts'],
  },
  {
    id: 'five-hindrances',
    category: 'core-teaching',
    title: 'The Five Hindrances (Nivarana)',
    source: 'Samadhanga Sutta (AN 5.28)',
    tradition: 'All Buddhist',
    text: `The five mental obstacles to meditation and clear seeing:

1. Sensual Desire (Kamacchanda): The mind chasing after pleasant experiences. Antidote: Contemplate impermanence and the drawbacks of sense pleasures.

2. Ill-Will (Vyapada): Aversion, anger, resentment. Antidote: Cultivate loving-kindness (metta) meditation.

3. Sloth and Torpor (Thina-Middha): Dullness, drowsiness, lack of energy. Antidote: Arouse energy through effort, change posture, contemplate light.

4. Restlessness and Worry (Uddhacca-Kukkucca): Agitation, inability to settle. Antidote: Cultivate calm through focused attention, resolve worries consciously.

5. Doubt (Vicikiccha): Indecision, uncertainty about the practice. Antidote: Study the teachings, reflect on your own experience, consult a teacher.`,
    teaching: 'The hindrances are not enemies to destroy but weather patterns to observe. Recognizing them clearly is itself the practice. Every meditator encounters them.',
    keywords: ['hindrances', 'obstacles', 'desire', 'aversion', 'sloth', 'restlessness', 'doubt', 'meditation'],
  },
  {
    id: 'seven-factors-awakening',
    category: 'core-teaching',
    title: 'The Seven Factors of Awakening (Bojjhanga)',
    source: 'Bojjhanga Sutta (SN 46.1)',
    tradition: 'All Buddhist',
    text: `The seven qualities that lead to awakening:

1. Mindfulness (Sati): Clear, present-moment awareness. The foundation that supports all other factors.
2. Investigation (Dhamma Vicaya): Active inquiry into the nature of experience. Examining phenomena with wisdom.
3. Energy (Viriya): Sustained effort and enthusiasm for the practice.
4. Joy (Piti): Rapture and delight that arises from wholesome practice.
5. Tranquility (Passaddhi): Calm and serenity of body and mind.
6. Concentration (Samadhi): Unification of mind, one-pointed focus.
7. Equanimity (Upekkha): Balance of mind, neither grasping nor pushing away.

These factors exist in a natural balance: when the mind is sluggish, emphasize investigation, energy, and joy. When the mind is agitated, emphasize tranquility, concentration, and equanimity.`,
    teaching: 'These seven factors represent the natural unfolding of a well-practiced mind. They are not goals to achieve but qualities that emerge through consistent practice.',
    keywords: ['awakening', 'enlightenment', 'bojjhanga', 'mindfulness', 'investigation', 'energy', 'joy', 'tranquility', 'concentration', 'equanimity'],
  },
  {
    id: 'stages-of-enlightenment',
    category: 'core-teaching',
    title: 'The Four Stages of Enlightenment',
    source: 'Sotapatti Sutta & Various',
    tradition: 'Theravada',
    text: `1. Stream-Enterer (Sotapanna): Has broken the first three fetters — identity view, doubt, and attachment to rites and rituals. Will be reborn at most seven more times. Has unshakeable confidence in the Buddha, Dhamma, and Sangha.

2. Once-Returner (Sakadagami): Has weakened sensual desire and ill-will. Will be reborn in the human world at most one more time.

3. Non-Returner (Anagami): Has fully abandoned sensual desire and ill-will. Will not be reborn in the human world but may be reborn in the pure abodes.

4. Arahant: Has destroyed all ten fetters and all defilements. Fully awakened. Free from the cycle of rebirth. "Done is what had to be done."`,
    teaching: 'These stages show that awakening is progressive — it happens in stages as fetters are broken. Even the first stage, stream-entry, is considered a profound transformation.',
    keywords: ['enlightenment', 'stream-enterer', 'arahant', 'awakening', 'stages', 'fetters', 'liberation'],
  },
  {
    id: 'six-paramitas',
    category: 'core-teaching',
    title: 'The Six Paramitas (Perfections)',
    source: 'Prajnaparamita Literature',
    tradition: 'Mahayana',
    text: `The six perfections of the bodhisattva path:

1. Generosity (Dana): Giving of material things, protection, and dharma teachings. True generosity is without attachment to giver, receiver, or gift.

2. Ethical Conduct (Sila): Refraining from harm, gathering virtue, and benefiting beings. Living with integrity and care.

3. Patience (Kshanti): Endurance in the face of suffering, forgiveness toward those who harm, and patience in understanding the dharma.

4. Joyful Effort (Virya): Enthusiastic perseverance in wholesome activities. Taking delight in virtue rather than treating it as a burden.

5. Meditation (Dhyana): Training the mind in concentration and insight. Developing stability, clarity, and peace.

6. Wisdom (Prajna): Direct insight into emptiness (shunyata) — the ultimate nature of reality. Seeing that all phenomena lack inherent existence.`,
    teaching: 'The paramitas are the practice of the bodhisattva — one who seeks enlightenment for the benefit of all beings. Wisdom (prajna) is said to guide all the other perfections.',
    keywords: ['paramitas', 'perfections', 'bodhisattva', 'generosity', 'patience', 'wisdom', 'prajna', 'mahayana'],
  },
  {
    id: 'bodhicitta',
    category: 'core-teaching',
    title: 'Bodhicitta — The Awakening Heart',
    source: 'Bodhicaryavatara (Shantideva)',
    tradition: 'Mahayana / Tibetan',
    text: `Bodhicitta is the sincere wish to attain complete enlightenment for the benefit of all sentient beings. It has two aspects:

Relative Bodhicitta:
- Aspiration Bodhicitta: The wish — "May I attain enlightenment for the sake of all beings."
- Engaged Bodhicitta: The action — actively practicing the six paramitas to fulfill that wish.

Ultimate Bodhicitta:
- Direct insight into the empty, luminous nature of mind and reality. Beyond concepts, beyond self and other.

Shantideva wrote: "Whatever joy there is in this world, all comes from desiring others to be happy. Whatever suffering there is in this world, all comes from desiring myself to be happy."`,
    teaching: 'Bodhicitta transforms the entire spiritual path from a personal pursuit into a universal mission. It is considered the most powerful force for spiritual development in Mahayana Buddhism.',
    keywords: ['bodhicitta', 'awakening mind', 'compassion', 'bodhisattva', 'shantideva', 'enlightenment', 'altruism'],
  },
  {
    id: 'emptiness',
    category: 'core-teaching',
    title: 'Emptiness (Shunyata)',
    source: 'Nagarjuna, Mulamadhyamakakarika',
    tradition: 'Mahayana',
    text: `Emptiness does not mean nothingness. It means that all phenomena are empty of inherent, independent existence. Everything exists only in dependence on:
- Causes and conditions
- Parts and components
- Mental designation and labeling

Nagarjuna taught: "Whatever is dependently arisen, that is explained to be emptiness. That, being a dependent designation, is itself the middle way."

The two truths:
- Conventional truth (Samvriti Satya): Things appear and function in the everyday world. We can speak of tables, people, and suffering.
- Ultimate truth (Paramartha Satya): Upon analysis, nothing can be found to exist from its own side. All phenomena are like dreams, illusions, reflections.

These two truths are not contradictory — they are two ways of understanding the same reality.`,
    teaching: 'Emptiness is not nihilism. Understanding emptiness frees us from fixed views and rigid concepts, allowing compassion and wisdom to flow naturally. Form is emptiness, emptiness is form.',
    keywords: ['emptiness', 'shunyata', 'nagarjuna', 'two truths', 'dependent arising', 'middle way', 'madhyamaka'],
  },
];

// ─── SUTRAS AND SUTTAS ──────────────────────────────────────────

export const SUTRAS = [
  {
    id: 'heart-sutra',
    category: 'sutra',
    title: 'The Heart Sutra (Prajnaparamita Hridaya)',
    source: 'Prajnaparamita Literature',
    tradition: 'Mahayana',
    text: `Avalokiteshvara, the bodhisattva of compassion, while practicing deep prajna paramita, clearly saw that all five aggregates are empty, and crossed beyond all suffering.

"Form is emptiness, emptiness is form. Emptiness is not other than form, form is not other than emptiness. In the same way, feeling, perception, mental formations, and consciousness are empty.

All phenomena are marked with emptiness. They are neither produced nor destroyed, neither defiled nor pure, neither increasing nor decreasing.

Therefore, in emptiness there is no form, no feeling, no perception, no mental formations, no consciousness. No eye, no ear, no nose, no tongue, no body, no mind. No form, no sound, no smell, no taste, no touch, no mental object.

There is no ignorance and no end of ignorance. No suffering, no origin of suffering, no cessation, no path. No wisdom and no attainment.

Because there is no attainment, bodhisattvas rely on prajna paramita, and their minds are without hindrance. Without hindrance, there is no fear. Far beyond all inverted views, they realize nirvana.

Gate gate paragate parasamgate bodhi svaha.
(Gone, gone, gone beyond, gone completely beyond — awakening!)"`,
    teaching: 'The Heart Sutra is the essence of the Prajnaparamita literature — the perfection of wisdom. It reveals that even the most fundamental Buddhist concepts (suffering, path, nirvana) are empty of inherent existence.',
    keywords: ['heart sutra', 'emptiness', 'prajna paramita', 'form is emptiness', 'avalokiteshvara', 'gate gate'],
  },
  {
    id: 'diamond-sutra',
    category: 'sutra',
    title: 'The Diamond Sutra — Key Verses',
    source: 'Vajracchedika Prajnaparamita Sutra',
    tradition: 'Mahayana',
    text: `"Subhuti, what do you think? Can the Tathagata be recognized by means of his physical body?"
"No, World-Honored One. The Tathagata cannot be recognized by means of his physical body. Why? Because what the Tathagata calls a physical body is not a physical body."

"All conditioned phenomena are like a dream, an illusion, a bubble, a shadow, like dew or a flash of lightning; thus we shall perceive them."

"Subhuti, if a good man or good woman, in order to practice generosity, were to give away as many lives as the sand grains of the Ganges, their merit would not equal that of a person who, having understood even a four-line verse of this sutra, explains it to others."

"Wherever this sutra is honored and revered, there is a sacred place of the Buddha. It should be honored and revered as if it were the Buddha himself."

"A bodhisattva who gives rise to the thought of enlightenment should not hold onto any fixed view of things, should not give rise to a mind that dwells on anything."`,
    teaching: 'The Diamond Sutra cuts through all illusion like a diamond. It teaches non-attachment even to spiritual concepts and reveals that true generosity arises from seeing the emptiness of giver, gift, and recipient.',
    keywords: ['diamond sutra', 'vajracchedika', 'non-attachment', 'illusion', 'emptiness', 'subhuti'],
  },
  {
    id: 'metta-sutta',
    category: 'sutra',
    title: 'The Metta Sutta (Discourse on Loving-Kindness)',
    source: 'Sutta Nipata 1.8',
    tradition: 'Theravada',
    text: `This is what should be done by one who is skilled in goodness and who knows the path of peace:

Let them be able and upright, straightforward and gentle in speech, humble and not conceited, contented and easily satisfied, unburdened with duties and frugal in their ways. Peaceful and calm and wise and skillful, not proud or demanding in nature.

Let none deceive another, or despise any being in any state. Let none through anger or ill-will wish harm upon another.

Even as a mother protects with her life her child, her only child, so with a boundless heart should one cherish all living beings, radiating kindness over the entire world:

Spreading upwards to the skies, and downwards to the depths, outwards and unbounded, free from hatred and ill-will.

Whether standing or walking, seated or lying down, one should sustain this recollection. This is said to be the sublime abiding.`,
    teaching: 'The Metta Sutta is one of the most beloved texts in Buddhism. It describes the ideal qualities of a practitioner and the boundless nature of loving-kindness that extends to all beings without exception.',
    keywords: ['metta', 'loving-kindness', 'sutta nipata', 'compassion', 'boundless heart', 'all beings'],
  },
  {
    id: 'kalama-sutta',
    category: 'sutra',
    title: 'The Kalama Sutta — Charter of Free Inquiry',
    source: 'Anguttara Nikaya 3.65',
    tradition: 'Theravada',
    text: `The Buddha spoke to the Kalamas: "It is proper for you to doubt, to be uncertain. Uncertainty has arisen in you about what is doubtful.

Come, Kalamas. Do not go upon what has been acquired by repeated hearing, nor upon tradition, nor upon rumor, nor upon what is in a scripture, nor upon surmise, nor upon an axiom, nor upon specious reasoning, nor upon a bias toward a notion that has been pondered over, nor upon another's seeming ability, nor upon the consideration that 'This monk is our teacher.'

When you yourselves know: 'These things are wholesome; these things are not blameworthy; these things are praised by the wise; undertaken and observed, these things lead to benefit and happiness' — enter on and abide in them."`,
    teaching: 'The Kalama Sutta is remarkable for encouraging critical thinking over blind faith. The Buddha invites us to test teachings against our own experience and reason — a radical stance for any spiritual tradition.',
    keywords: ['kalama', 'free inquiry', 'doubt', 'critical thinking', 'investigation', 'experience', 'wisdom'],
  },
  {
    id: 'satipatthana-summary',
    category: 'sutra',
    title: 'The Satipatthana Sutta — Four Foundations of Mindfulness',
    source: 'Majjhima Nikaya 10',
    tradition: 'Theravada',
    text: `"This is the direct path for the purification of beings, for the surmounting of sorrow and lamentation, for the disappearance of pain and grief, for the attainment of the true way, for the realization of Nibbana — namely, the four foundations of mindfulness.

1. Contemplation of the Body (Kayanupassana): Mindfulness of breathing, postures, bodily activities, anatomical parts, elements, and the charnel ground contemplations.

2. Contemplation of Feelings (Vedananupassana): Knowing feelings as they arise — pleasant, unpleasant, or neutral — and seeing their conditioned nature.

3. Contemplation of Mind (Cittanupassana): Knowing the state of mind — whether it contains lust or is free from lust, whether it is contracted or expanded, concentrated or unconcentrated.

4. Contemplation of Mental Objects (Dhammanupassana): Investigating the five hindrances, five aggregates, six sense bases, seven factors of awakening, and the Four Noble Truths."`,
    teaching: 'The Satipatthana Sutta is considered the most important meditation text in Theravada Buddhism. It lays out a comprehensive framework for developing the mindfulness that leads to liberation.',
    keywords: ['satipatthana', 'mindfulness', 'four foundations', 'body', 'feelings', 'mind', 'vipassana', 'meditation'],
  },
  {
    id: 'fire-sermon',
    category: 'sutra',
    title: 'The Fire Sermon (Adittapariyaya Sutta)',
    source: 'Samyutta Nikaya 35.28',
    tradition: 'Theravada',
    text: `"Monks, all is burning. And what is the all that is burning?

The eye is burning, forms are burning, eye-consciousness is burning, eye-contact is burning. Whatever feeling arises with eye-contact as its condition — whether pleasant, painful, or neutral — that too is burning.

Burning with what? Burning with the fire of passion, with the fire of aversion, with the fire of delusion. Burning with birth, aging, death, sorrow, lamentation, pain, grief, and despair.

The ear is burning... The nose is burning... The tongue is burning... The body is burning... The mind is burning...

Seeing thus, the well-instructed noble disciple becomes disenchanted with the eye, disenchanted with forms... becomes disenchanted with the mind, disenchanted with mental objects.

Being disenchanted, one becomes dispassionate. Through dispassion, one is liberated."`,
    teaching: 'The Fire Sermon shows that our entire sensory experience is "burning" with craving, aversion, and delusion. Liberation comes through seeing this clearly and developing disenchantment — not hatred of experience, but a wise stepping back.',
    keywords: ['fire sermon', 'burning', 'senses', 'craving', 'aversion', 'delusion', 'disenchantment', 'liberation'],
  },
  {
    id: 'dhammapada-selections',
    category: 'sutra',
    title: 'Dhammapada — Selected Verses',
    source: 'Dhammapada',
    tradition: 'Theravada',
    text: `Chapter 1 — The Mind:
"Mind is the forerunner of all actions. All deeds are led by mind, created by mind. If one speaks or acts with a corrupt mind, suffering follows, as the wheel follows the hoof of the ox."
"If one speaks or acts with a pure mind, happiness follows, like a shadow that never departs."

Chapter 11 — Old Age:
"What laughter, why joy, when flames are ever burning? Shrouded in darkness, would you not seek light?"

Chapter 14 — The Awakened One:
"Whose conquest is not undone, whom no conquered thing can ever follow — by what track can you trace that trackless, awakened, infinite-ranged one?"

Chapter 15 — Happiness:
"We live most happily when we live without hatred among those who hate. Among those who hate, we dwell without hatred."

Chapter 20 — The Path:
"You yourself must strive. The Buddhas only point the way. Those who have entered the path and who meditate will be freed from the bonds of illusion."

Chapter 26 — The Holy One:
"Cut down the forest of desire, not just one tree. From the forest springs fear. Having cut down both forest and undergrowth, be passionless."`,
    teaching: 'The Dhammapada is the most widely read Buddhist scripture. Its 423 verses distill the essence of the Buddha\'s teachings into accessible, poetic wisdom.',
    keywords: ['dhammapada', 'mind', 'happiness', 'path', 'desire', 'wisdom', 'verses', 'poetry'],
  },
];

// ─── ZEN KOANS ──────────────────────────────────────────────────

export const KOANS = [
  {
    id: 'mu',
    category: 'koan',
    title: 'Joshu\'s Dog (Mu)',
    source: 'The Gateless Gate, Case 1',
    tradition: 'Zen',
    text: 'A monk asked Joshu: "Does a dog have Buddha-nature?" Joshu said: "Mu."',
    teaching: 'Mu (nothing/no) is not a logical answer but a barrier that breaks through conceptual thinking. It is the most famous koan in Zen, given to beginners as their first practice.',
    keywords: ['mu', 'joshu', 'buddha-nature', 'gateless gate', 'koan', 'zen'],
  },
  {
    id: 'one-hand',
    category: 'koan',
    title: 'The Sound of One Hand',
    source: 'Hakuin Ekaku',
    tradition: 'Zen',
    text: 'Two hands clap and there is a sound. What is the sound of one hand?',
    teaching: 'This koan points to the nature of non-duality. It cannot be answered with logic — it must be demonstrated. It points beyond the world of opposites.',
    keywords: ['one hand', 'hakuin', 'sound', 'non-duality', 'koan'],
  },
  {
    id: 'original-face',
    category: 'koan',
    title: 'Original Face',
    source: 'Huineng, Sixth Patriarch',
    tradition: 'Zen',
    text: 'What was your original face before your parents were born?',
    teaching: 'This koan invites us to look beyond conditioned identity — beyond name, form, history — to discover our true nature that existed before all concepts.',
    keywords: ['original face', 'huineng', 'true nature', 'identity', 'before birth'],
  },
  {
    id: 'cypress-tree',
    category: 'koan',
    title: 'The Cypress Tree in the Garden',
    source: 'The Gateless Gate, Case 37',
    tradition: 'Zen',
    text: 'A monk asked Joshu: "What is the meaning of the Patriarch\'s coming from the West?" Joshu said: "The cypress tree in the garden."',
    teaching: 'The meaning of Zen is not hidden in philosophy or history — it is right here in the ordinary world. The cypress tree is the truth, if only you have eyes to see.',
    keywords: ['cypress tree', 'joshu', 'meaning', 'ordinary', 'here and now'],
  },
  {
    id: 'wash-bowl',
    category: 'koan',
    title: 'Wash Your Bowl',
    source: 'The Gateless Gate, Case 7',
    tradition: 'Zen',
    text: 'A monk told Joshu: "I have just entered the monastery. Please teach me." Joshu asked: "Have you eaten your rice porridge?" The monk replied: "I have eaten." Joshu said: "Then you had better wash your bowl."',
    teaching: 'Enlightenment is not separate from ordinary activity. The deepest teaching is in the simplest actions, done with full awareness. After eating, wash your bowl. After understanding, practice.',
    keywords: ['wash bowl', 'joshu', 'ordinary', 'practice', 'everyday', 'mindfulness'],
  },
  {
    id: 'killing-buddha',
    category: 'koan',
    title: 'If You Meet the Buddha, Kill Him',
    source: 'Linji Yixuan (Rinzai)',
    tradition: 'Zen',
    text: '"If you meet the Buddha on the road, kill him." — Linji',
    teaching: 'Do not cling to any image, concept, or authority — even the Buddha. If you make the Buddha into a fixed idea to worship, you have missed the point. True awakening is beyond all concepts, even the concept of enlightenment.',
    keywords: ['kill buddha', 'linji', 'rinzai', 'non-attachment', 'authority', 'concepts'],
  },
  {
    id: 'empty-cup',
    category: 'koan',
    title: 'A Cup of Tea (Empty Your Cup)',
    source: 'Nan-in, Meiji Era',
    tradition: 'Zen',
    text: 'A university professor visited the Zen master Nan-in to learn about Zen. Nan-in served tea. He poured his visitor\'s cup full, and then kept on pouring. The professor watched the overflow until he could no longer restrain himself. "It is overfull! No more will go in!" Nan-in said: "Like this cup, you are full of your own opinions and speculations. How can I show you Zen unless you first empty your cup?"',
    teaching: 'To receive new understanding, we must first let go of what we think we already know. Beginner\'s mind is essential for real learning.',
    keywords: ['empty cup', 'nan-in', 'beginners mind', 'openness', 'learning', 'opinions'],
  },
  {
    id: 'flag-wind',
    category: 'koan',
    title: 'Not the Wind, Not the Flag',
    source: 'Platform Sutra of Huineng',
    tradition: 'Zen',
    text: 'Two monks were arguing about a flag flapping in the wind. One said: "The flag is moving." The other said: "The wind is moving." Huineng, the Sixth Patriarch, overheard and said: "Not the wind, not the flag; mind is moving."',
    teaching: 'All perception is a function of mind. What we think we see "out there" is actually a projection of our own consciousness. Understanding this is the beginning of liberation.',
    keywords: ['flag', 'wind', 'mind', 'huineng', 'perception', 'consciousness'],
  },
  {
    id: 'finger-moon',
    category: 'koan',
    title: 'The Finger Pointing at the Moon',
    source: 'Lankavatara Sutra / Zen Tradition',
    tradition: 'Zen / Mahayana',
    text: '"Truth has nothing to do with words. Truth can be likened to the bright moon in the sky. Words are like a finger pointing at the moon. The finger can point to the moon\'s location, but the finger is not the moon. To look at the moon, it is necessary to gaze beyond the finger."',
    teaching: 'Do not confuse the teaching with the truth it points to. Words, concepts, and scriptures are tools — not destinations. The map is not the territory.',
    keywords: ['finger', 'moon', 'words', 'truth', 'concepts', 'beyond words', 'direct experience'],
  },
  {
    id: 'stone-mind',
    category: 'koan',
    title: 'Moving the Stone Mind',
    source: 'Blue Cliff Record, Case 12',
    tradition: 'Zen',
    text: 'Dongshan asked Caoshan: "Where do you come from?" Caoshan said: "From the top of a mountain." Dongshan asked: "Did you reach the summit?" Caoshan said: "Yes." Dongshan asked: "Was there anyone on the summit?" Caoshan said: "No." Dongshan said: "Then you did not reach the summit." Caoshan said: "If I had not reached the summit, how could I know there was no one there?"',
    teaching: 'This koan plays with the paradox of transcendence. To truly go beyond, one must leave even the idea of "going beyond" behind. Yet the knowing itself proves the journey.',
    keywords: ['dongshan', 'caoshan', 'summit', 'transcendence', 'paradox', 'blue cliff record'],
  },
];

// ─── TIBETAN BUDDHISM ───────────────────────────────────────────

export const TIBETAN = [
  {
    id: 'tonglen',
    category: 'practice',
    title: 'Tonglen — Giving and Taking',
    source: 'Atisha / Tibetan Lojong Tradition',
    tradition: 'Tibetan',
    text: `Tonglen is the practice of exchanging self for others through the breath:

On the in-breath: Breathe in the suffering of others. Visualize it as dark, heavy smoke entering your heart. Let it dissolve the hard knot of self-cherishing.

On the out-breath: Breathe out your happiness, merit, health, and peace. Visualize it as bright, healing light radiating to all beings.

Begin with your own suffering. Then extend to loved ones, then to neutral people, then to those you find difficult, and finally to all beings everywhere.

This practice seems counterintuitive — why would you breathe in suffering? Because the willingness to take on suffering dissolves the walls of ego. The fear of suffering perpetuates it. Tonglen breaks through that fear.`,
    teaching: 'Tonglen reverses the habitual pattern of avoiding pain and grasping pleasure. It builds fearless compassion and dissolves the illusion of a separate self.',
    keywords: ['tonglen', 'giving and taking', 'compassion', 'breathing', 'lojong', 'atisha', 'exchange'],
  },
  {
    id: 'bardo',
    category: 'teaching',
    title: 'The Bardos — Intermediate States',
    source: 'Bardo Thodol (Tibetan Book of the Dead)',
    tradition: 'Tibetan',
    text: `The bardos are intermediate states or transitions:

1. The Bardo of This Life (Kyenay Bardo): Our ordinary waking experience from birth to death. The opportunity to practice and awaken.

2. The Bardo of Meditation (Samten Bardo): The state of deep meditation where ordinary appearances dissolve and the nature of mind is glimpsed.

3. The Bardo of Dream (Milam Bardo): The dream state, where we can practice dream yoga and lucid dreaming as preparation for death.

4. The Bardo of Dying (Chikhai Bardo): The process of death, when the elements dissolve and consciousness separates from the body.

5. The Bardo of Dharmata (Chonyid Bardo): After death, the true nature of mind manifests as light, sound, and vision. If recognized, liberation occurs.

6. The Bardo of Becoming (Sipai Bardo): If not liberated in the previous bardo, consciousness moves toward rebirth, driven by karmic patterns.

The key teaching: every moment is a bardo — a transition. Every ending is a beginning. Practice now, for the skills you develop in life serve you at the moment of death.`,
    teaching: 'The concept of bardos extends beyond death to encompass all transitions in life. Every moment of change is an opportunity for awakening — or for habitual reaction.',
    keywords: ['bardo', 'death', 'dying', 'tibetan book of dead', 'transition', 'intermediate state', 'rebirth'],
  },
  {
    id: 'lojong-slogans',
    category: 'teaching',
    title: 'Lojong — Mind Training Slogans (Selected)',
    source: 'Atisha / Geshe Chekawa',
    tradition: 'Tibetan',
    text: `Selected slogans from the 59 Lojong mind training aphorisms:

"First, train in the preliminaries." — Contemplate the preciousness of human life, impermanence, karma, and suffering.

"Regard all dharmas as dreams." — All phenomena are like a dream — vivid but insubstantial.

"Drive all blames into one." — Instead of blaming others, look at your own mind. Self-cherishing is the root of all suffering.

"Be grateful to everyone." — Every person, especially difficult ones, is your teacher. They give you the opportunity to practice patience and compassion.

"Don't be swayed by external circumstances." — Practice whether things go well or badly. Both are equally opportunities.

"Don't expect applause." — Practice for its own sake, not for recognition or reward.

"Always meditate on whatever provokes resentment." — Your triggers are your teachers. What disturbs you most shows you where your work is.

"Don't be so predictable." — Break habitual patterns. Surprise yourself with generosity, patience, and openness.

"Don't malign others." — Speaking ill of others poisons your own mind.

"Whichever of the two occurs, be patient." — Whether you experience happiness or suffering, maintain equanimity.`,
    teaching: 'The Lojong slogans are practical instructions for transforming the mind in daily life. They are designed to be memorized and applied in real situations — on the street, at work, in relationships.',
    keywords: ['lojong', 'mind training', 'slogans', 'atisha', 'patience', 'compassion', 'daily practice'],
  },
  {
    id: 'nature-of-mind',
    category: 'teaching',
    title: 'The Nature of Mind (Rigpa)',
    source: 'Dzogchen / Mahamudra Tradition',
    tradition: 'Tibetan',
    text: `The nature of mind has three qualities:

1. Emptiness (Essence): The mind has no inherent existence, no color, no shape, no location. It is open and spacious like the sky.

2. Luminosity (Nature): Despite being empty, the mind is not nothing — it is cognizant, aware, knowing. It is naturally radiant.

3. Unimpeded (Expression): Thoughts, emotions, and perceptions arise freely and without obstruction, like waves on the ocean.

These three — emptiness, luminosity, and unimpeded awareness — are not separate things but three aspects of one reality.

The practice is simple but profound: rest in the natural state of mind without altering, fabricating, or following thoughts. Let everything arise and dissolve naturally, like clouds in the sky. The sky is never stained by clouds, no matter how thick they may be.

Tilopa said: "Do not pursue the past. Do not invite the future. Do not alter the present. Relax, just as it is."`,
    teaching: 'In Dzogchen, the nature of mind is already perfect and complete. There is nothing to attain — only something to recognize. The practice is resting in what is already here.',
    keywords: ['rigpa', 'nature of mind', 'dzogchen', 'mahamudra', 'emptiness', 'luminosity', 'awareness', 'tilopa'],
  },
];

// ─── TEACHERS' WISDOM ───────────────────────────────────────────

export const TEACHERS = [
  {
    id: 'tnh-present-moment',
    category: 'teacher-quote',
    title: 'On the Present Moment',
    source: 'Thich Nhat Hanh',
    tradition: 'Zen / Engaged Buddhism',
    text: 'The present moment is the only moment available to us, and it is the door to all moments.',
    teaching: 'Thich Nhat Hanh constantly returned to this theme: the miracle is not to walk on water but to walk on the green earth in the present moment, to appreciate the beauty and peace that are available.',
    keywords: ['thich nhat hanh', 'present moment', 'mindfulness', 'peace', 'now'],
  },
  {
    id: 'tnh-breathing',
    category: 'teacher-quote',
    title: 'On Conscious Breathing',
    source: 'Thich Nhat Hanh',
    tradition: 'Zen / Engaged Buddhism',
    text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.',
    teaching: 'The breath is always available as a refuge — a place to return when the storms of emotion and thought arise.',
    keywords: ['thich nhat hanh', 'breathing', 'feelings', 'anchor', 'clouds'],
  },
  {
    id: 'tnh-peace',
    category: 'teacher-quote',
    title: 'On Being Peace',
    source: 'Thich Nhat Hanh',
    tradition: 'Zen / Engaged Buddhism',
    text: 'Peace is every step. The shining red sun is my heart. Each flower smiles with me. How green, how fresh all that grows. How cool the wind blows. Peace is every step. It turns the endless path to joy.',
    teaching: 'Peace is not a destination to reach but a way of walking through life. Every step can be a step of peace if taken with mindfulness.',
    keywords: ['thich nhat hanh', 'peace', 'walking', 'joy', 'mindfulness', 'nature'],
  },
  {
    id: 'suzuki-beginners',
    category: 'teacher-quote',
    title: 'On Beginner\'s Mind',
    source: 'Shunryu Suzuki',
    tradition: 'Zen',
    text: 'In the beginner\'s mind there are many possibilities, but in the expert\'s mind there are few.',
    teaching: 'The freshness and openness of a beginner — approaching each moment without preconceptions — is the essence of Zen practice. The more we think we know, the less we see.',
    keywords: ['suzuki', 'beginners mind', 'openness', 'possibilities', 'zen mind'],
  },
  {
    id: 'suzuki-everyday',
    category: 'teacher-quote',
    title: 'On Everyday Practice',
    source: 'Shunryu Suzuki',
    tradition: 'Zen',
    text: 'When you do something, you should burn yourself up completely, like a good bonfire, leaving no trace of yourself.',
    teaching: 'Complete engagement in whatever you are doing — whether cooking, cleaning, or meditating — is the practice. Leave nothing held back, no observer watching from the sidelines.',
    keywords: ['suzuki', 'complete engagement', 'practice', 'wholehearted', 'everyday'],
  },
  {
    id: 'pema-groundlessness',
    category: 'teacher-quote',
    title: 'On Groundlessness',
    source: 'Pema Chodron',
    tradition: 'Tibetan',
    text: 'To be fully alive, fully human, and completely awake is to be continually thrown out of the nest.',
    teaching: 'Growth requires embracing uncertainty rather than seeking solid ground. The very groundlessness we fear is the space where awakening happens.',
    keywords: ['pema chodron', 'groundlessness', 'uncertainty', 'growth', 'awakening', 'fear'],
  },
  {
    id: 'pema-compassion',
    category: 'teacher-quote',
    title: 'On Compassion',
    source: 'Pema Chodron',
    tradition: 'Tibetan',
    text: 'Compassion is not a relationship between the healer and the wounded. It is a relationship between equals. Only when we know our own darkness well can we be present with the darkness of others.',
    teaching: 'True compassion does not come from a position of superiority but from recognizing our shared vulnerability and humanity.',
    keywords: ['pema chodron', 'compassion', 'equality', 'darkness', 'healing', 'vulnerability'],
  },
  {
    id: 'ajahn-chah-still-water',
    category: 'teacher-quote',
    title: 'On Still, Flowing Water',
    source: 'Ajahn Chah',
    tradition: 'Theravada',
    text: 'Try to be mindful, and let things take their natural course. Then your mind will become still in any surroundings, like a clear forest pool. All kinds of wonderful, rare animals will come to drink at the pool, and you will clearly see the nature of all things. You will see many strange and wonderful things come and go, but you will be still. This is the happiness of the Buddha.',
    teaching: 'Ajahn Chah\'s teaching is deceptively simple: be still, be aware, let things come and go. The still mind reveals the nature of everything that passes through it.',
    keywords: ['ajahn chah', 'still water', 'forest pool', 'mindfulness', 'natural', 'stillness', 'happiness'],
  },
  {
    id: 'ajahn-chah-uncertain',
    category: 'teacher-quote',
    title: 'On Uncertainty',
    source: 'Ajahn Chah',
    tradition: 'Theravada',
    text: 'If you let go a little, you will have a little happiness. If you let go a lot, you will have a lot of happiness. If you let go completely, you will be free.',
    teaching: 'The degree of our happiness is directly proportional to the degree of our letting go. Freedom is total non-clinging.',
    keywords: ['ajahn chah', 'letting go', 'happiness', 'freedom', 'non-attachment', 'release'],
  },
  {
    id: 'dalai-lama-kindness',
    category: 'teacher-quote',
    title: 'On Kindness',
    source: 'Dalai Lama XIV',
    tradition: 'Tibetan',
    text: 'My religion is very simple. My religion is kindness.',
    teaching: 'Despite the vast complexity of Buddhist philosophy, the Dalai Lama distills it to its essence: kindness. All practices, all teachings, lead to this.',
    keywords: ['dalai lama', 'kindness', 'simplicity', 'religion', 'compassion'],
  },
  {
    id: 'dalai-lama-enemies',
    category: 'teacher-quote',
    title: 'On Enemies as Teachers',
    source: 'Dalai Lama XIV',
    tradition: 'Tibetan',
    text: 'In the practice of tolerance, one\'s enemy is the best teacher.',
    teaching: 'Those who challenge us the most provide the greatest opportunities for spiritual growth. Patience cannot be practiced without obstacles.',
    keywords: ['dalai lama', 'enemies', 'teachers', 'patience', 'tolerance', 'obstacles'],
  },
  {
    id: 'watts-present',
    category: 'teacher-quote',
    title: 'On This Moment',
    source: 'Alan Watts',
    tradition: 'Zen (Western interpretation)',
    text: 'This is the real secret of life — to be completely engaged with what you are doing in the here and now. And instead of calling it work, realize it is play.',
    teaching: 'Alan Watts bridges Eastern wisdom and Western culture. His insight that life is fundamentally playful reframes spiritual practice from grim duty to joyful engagement.',
    keywords: ['alan watts', 'present', 'engagement', 'play', 'here and now', 'joy'],
  },
  {
    id: 'ram-dass-be-here',
    category: 'teacher-quote',
    title: 'Be Here Now',
    source: 'Ram Dass',
    tradition: 'Hindu-Buddhist Synthesis',
    text: 'The quieter you become, the more you can hear.',
    teaching: 'In silence and stillness, we hear what the noise of mental chatter has been drowning out — the voice of intuition, of presence, of being itself.',
    keywords: ['ram dass', 'quiet', 'listening', 'silence', 'stillness', 'presence'],
  },
  {
    id: 'dogen-practice',
    category: 'teacher-quote',
    title: 'On Practice-Enlightenment',
    source: 'Dogen Zenji',
    tradition: 'Zen',
    text: 'To study the Way is to study the self. To study the self is to forget the self. To forget the self is to be enlightened by the ten thousand things.',
    teaching: 'Dogen\'s famous formulation shows that the path goes inward first, then dissolves the boundary between self and world entirely. Enlightenment is the falling away of the illusion of separation.',
    keywords: ['dogen', 'study self', 'forget self', 'enlightenment', 'ten thousand things', 'soto zen'],
  },
  {
    id: 'milarepa-cave',
    category: 'teacher-quote',
    title: 'On Facing Demons',
    source: 'Milarepa',
    tradition: 'Tibetan',
    text: 'Demons, ghosts, and malignant spirits are in reality projections of the mind. If you recognize this, they cannot harm you. If you do not recognize the nature of your own mind, then the whole of existence becomes your enemy.',
    teaching: 'Our fears and obstacles are projections of our own mind. Recognizing this is not a conceptual exercise but a direct seeing that transforms the relationship between self and adversity.',
    keywords: ['milarepa', 'demons', 'mind', 'fear', 'projections', 'recognition', 'adversity'],
  },
];

// ─── PARABLES ───────────────────────────────────────────────────

export const PARABLES = [
  {
    id: 'mustard-seed',
    category: 'parable',
    title: 'The Mustard Seed',
    source: 'Kisa Gotami Story',
    tradition: 'Theravada',
    text: 'Kisa Gotami, a young mother, came to the Buddha carrying her dead child, begging him to bring the child back to life. The Buddha said: "I can help you, but first you must bring me a mustard seed from a household where no one has ever died." She went from house to house, but everywhere she went, she heard stories of loss — a father, a mother, a child, a spouse. In every home, death had visited. Gradually, she understood: death touches all. She buried her child and returned to the Buddha, not with a mustard seed, but with understanding. She became one of his foremost disciples.',
    teaching: 'Suffering is universal. Understanding this connects us and brings compassion. The Buddha did not "fix" her grief — he helped her see it in its true context, which transformed it into wisdom.',
    keywords: ['mustard seed', 'kisa gotami', 'death', 'grief', 'universality', 'compassion', 'understanding'],
  },
  {
    id: 'raft-parable',
    category: 'parable',
    title: 'The Raft',
    source: 'Alagaddupama Sutta (MN 22)',
    tradition: 'Theravada',
    text: 'The Buddha said: "Suppose a man traveling through a wilderness comes to a great body of water. He builds a raft from grass, sticks, and branches, and crosses safely to the other shore. Having crossed, he thinks: \'This raft was very useful. Let me carry it on my head wherever I go.\' Would that be wise?" The monks said: "No, Lord." "In the same way, I have taught the Dhamma compared to a raft — for crossing over, not for holding onto. Having understood the Dhamma\'s similarity to a raft, you should let go even of teachings, to say nothing of non-teachings."',
    teaching: 'Even the Buddha\'s teachings are tools, not possessions. Do not cling even to wisdom. The dharma is a vehicle for liberation, not a trophy to carry. True understanding lets go of itself.',
    keywords: ['raft', 'letting go', 'teachings', 'non-attachment', 'crossing', 'tools', 'liberation'],
  },
  {
    id: 'blind-men-elephant',
    category: 'parable',
    title: 'The Blind Men and the Elephant',
    source: 'Udana 6.4',
    tradition: 'All Buddhist',
    text: 'A group of blind men were brought to examine an elephant. Each touched a different part. The one who touched the leg said: "An elephant is like a pillar." The one who touched the tail said: "An elephant is like a rope." The one who touched the trunk said: "An elephant is like a tree branch." The one who touched the ear said: "An elephant is like a fan." The one who touched the belly said: "An elephant is like a wall." The one who touched the tusk said: "An elephant is like a pipe." They began to argue violently, each insisting he was right.',
    teaching: 'Each person saw only their own partial view and mistook it for the whole truth. The parable warns against dogmatism and encourages humility — our perspective is always limited.',
    keywords: ['blind men', 'elephant', 'perspective', 'partial view', 'humility', 'dogmatism', 'truth'],
  },
  {
    id: 'poisoned-arrow',
    category: 'parable',
    title: 'The Poisoned Arrow',
    source: 'Cula-Malunkyovada Sutta (MN 63)',
    tradition: 'Theravada',
    text: 'A man is struck by a poisoned arrow. His friends rush to find a doctor, but the wounded man says: "Wait! I will not let the doctor remove this arrow until I know who shot it, what caste he belongs to, what kind of bow he used, what the arrow is made of, and what kind of poison was used." The Buddha said: "That man would die before all his questions were answered. In the same way, if someone says \'I will not practice until the Buddha explains whether the universe is eternal or finite, whether the soul and body are the same or different\' — that person would die before those questions were answered."',
    teaching: 'The Buddha taught what is useful for ending suffering, not metaphysical speculation. The practice is urgent — remove the arrow first, philosophize later. Some questions are not worth pursuing.',
    keywords: ['poisoned arrow', 'pragmatism', 'urgency', 'speculation', 'practice', 'suffering', 'useful'],
  },
  {
    id: 'handful-leaves',
    category: 'parable',
    title: 'A Handful of Leaves',
    source: 'Simsapa Sutta (SN 56.31)',
    tradition: 'Theravada',
    text: 'The Buddha picked up a handful of simsapa leaves and asked: "What do you think, monks? Which is more — the few leaves in my hand, or the leaves in the forest?" "The leaves in your hand are few, Lord. Those in the forest are far more numerous." "In the same way, the things I have directly known but have not taught you are far more numerous. And why have I not taught them? Because they are not beneficial, not fundamental to the holy life, and do not lead to disenchantment, dispassion, cessation, calm, direct knowledge, awakening, and nirvana."',
    teaching: 'The Buddha knew far more than he taught. He deliberately selected only what is essential for liberation. This reminds us to focus on what is useful rather than accumulating knowledge for its own sake.',
    keywords: ['leaves', 'selective teaching', 'essential', 'liberation', 'focus', 'useful knowledge'],
  },
  {
    id: 'two-wolves',
    category: 'parable',
    title: 'The Two Wolves Within',
    source: 'Buddhist Oral Tradition (adapted)',
    tradition: 'All Buddhist',
    text: 'A teacher told a student: "Inside you, two forces are constantly at war. One is fear, anger, envy, greed, arrogance, self-pity, guilt, resentment, and false pride. The other is joy, peace, love, hope, serenity, humility, kindness, empathy, generosity, and compassion." The student asked: "Which one wins?" The teacher replied: "The one you feed."',
    teaching: 'This parable distills the Buddhist understanding of mental cultivation. We become what we practice. Every moment of attention is nourishment for one pattern or the other.',
    keywords: ['two wolves', 'choice', 'mental cultivation', 'attention', 'practice', 'nourishment'],
  },
];

// ─── MEDITATION TECHNIQUES (Detailed) ───────────────────────────

export const MEDITATION_TECHNIQUES = [
  {
    id: 'vipassana-technique',
    category: 'meditation-technique',
    title: 'Vipassana (Insight) Meditation',
    source: 'Theravada Tradition / S.N. Goenka',
    tradition: 'Theravada',
    text: `Vipassana means "seeing things as they really are." It is one of India's most ancient meditation techniques.

Setup: Sit comfortably with spine straight. Eyes closed. Resolve to remain still for the duration.

Stage 1 — Anapana (5-10 min): Focus on the natural breath at the area below the nostrils and above the upper lip. Simply observe — do not control the breath. Notice its natural characteristics: long or short, heavy or light, rough or subtle.

Stage 2 — Body Scanning: Systematically move attention through the body, part by part, from the top of the head to the tips of the toes, then back up. Observe sensations — tingling, pressure, temperature, pain, numbness — with equanimity.

Stage 3 — Equanimity: Whatever arises — pleasant or unpleasant — observe with equanimity. Do not react with craving or aversion. Simply observe: "This too will pass."

Key principles:
- Anicca: All sensations are impermanent
- Work diligently, patiently, and persistently
- Do not generate new reactions (sankhara)
- Maintain perfect equanimity`,
    teaching: 'Vipassana works at the level of bodily sensation — deeper than the intellectual mind. By observing sensations with equanimity, we break the habit pattern of reactive craving and aversion at the deepest level.',
    keywords: ['vipassana', 'insight', 'body scan', 'equanimity', 'goenka', 'sensation', 'anicca', 'observation'],
  },
  {
    id: 'samatha-technique',
    category: 'meditation-technique',
    title: 'Samatha (Calm Abiding) Meditation',
    source: 'Theravada / Mahayana Traditions',
    tradition: 'All Buddhist',
    text: `Samatha develops concentration (samadhi) and tranquility. The mind is trained to rest on a single object.

Object of Meditation: The breath is the most common object. Other traditional objects include a kasina (colored disc), a visualization, or a mantra.

Instructions:
1. Establish attention on the breath at a single point (nostrils, chest, or abdomen).
2. When the mind wanders, gently return without judgment.
3. Gradually the mind settles, and distractions become less frequent.
4. As concentration deepens, subtle joy (piti) and happiness (sukha) arise.

The Five Stages of Concentration:
1. Placed attention: Initial contact with the object
2. Sustained attention: Maintaining focus
3. Joy: Rapture arising from concentration
4. Happiness: Deeper, calmer bliss
5. One-pointedness: Unified, absorbed awareness

Deep samatha leads to the jhanas — states of profound absorption where the mind becomes extremely refined, still, and luminous.`,
    teaching: 'Samatha develops the mental stability needed for insight. A calm, concentrated mind can see clearly. Many traditions teach samatha and vipassana together — calm and insight as two wings of a bird.',
    keywords: ['samatha', 'calm abiding', 'concentration', 'samadhi', 'jhana', 'tranquility', 'focus', 'breath'],
  },
  {
    id: 'zazen-technique',
    category: 'meditation-technique',
    title: 'Zazen (Zen Sitting Meditation)',
    source: 'Dogen Zenji / Soto Zen',
    tradition: 'Zen',
    text: `Zazen is "just sitting" — shikantaza. It is not meditation on something. It is the practice of being.

Posture: Sit on a zafu (cushion) in full or half lotus. Spine straight, chin slightly tucked, ears aligned with shoulders. Hands in cosmic mudra — left hand resting in right, thumb tips lightly touching, forming an oval.

Eyes: Half-open, gaze resting on the floor about 2-3 feet ahead. Not focused on anything.

Breathing: Natural breathing through the nose. No counting or controlling. Just breathe.

Mind: This is the key — there is no technique. Just sit. Thoughts will come. Do not follow them, do not push them away. Let them arise and pass like clouds in the sky. When you notice you've been lost in thought, gently return to just sitting.

There is nothing to achieve, nothing to become. This very moment of sitting IS enlightenment. Practice and enlightenment are one (shusho ittai).

Sit for at least 25-45 minutes. Use a timer. When the bell rings, bow, stand, and do kinhin (walking meditation) before the next round.`,
    teaching: 'Zazen strips away all technique and leaves only awareness itself. Dogen taught that zazen is not a means to enlightenment but the expression of our already-enlightened nature.',
    keywords: ['zazen', 'shikantaza', 'just sitting', 'dogen', 'soto', 'zen', 'posture', 'cosmic mudra'],
  },
  {
    id: 'metta-technique',
    category: 'meditation-technique',
    title: 'Metta (Loving-Kindness) Meditation — Full Practice',
    source: 'Visuddhimagga / Theravada Tradition',
    tradition: 'All Buddhist',
    text: `Metta meditation systematically develops unconditional goodwill toward all beings.

The Phrases (adapt to what resonates):
"May I be happy. May I be healthy. May I be safe. May I live with ease."

The Progression:
1. Self (5 min): Direct loving-kindness toward yourself. This is the foundation. You cannot give what you don't have.

2. Benefactor (5 min): Someone who has helped you — a teacher, mentor, or loved one. Easy to generate warmth for them.

3. Beloved friend (5 min): A close friend or family member you love dearly.

4. Neutral person (5 min): Someone you neither like nor dislike — a cashier, a neighbor, a stranger. This is where metta begins to stretch.

5. Difficult person (5 min): Someone who has caused you pain. Start with mildly difficult, not your worst enemy. This is the deepest practice.

6. All beings (5 min): "May all beings everywhere be happy. May all beings be free from suffering. May all beings find joy. May all beings live in peace."

Feel the intention behind the words. If the feeling is not there yet, that is okay. The practice is in the intention, and the feeling will grow over time.`,
    teaching: 'Metta is not pretending to like everyone. It is the cultivation of genuine goodwill — the wish for beings to be happy. It dissolves the barriers we build between self and other.',
    keywords: ['metta', 'loving-kindness', 'goodwill', 'compassion', 'practice', 'all beings', 'phrases', 'progression'],
  },
];

// ─── EXPORT COMBINED DATASET ────────────────────────────────────

export const FULL_DATASET = [
  ...CORE_TEACHINGS,
  ...SUTRAS,
  ...KOANS,
  ...TIBETAN,
  ...TEACHERS,
  ...PARABLES,
  ...MEDITATION_TECHNIQUES,
];

export function searchDataset(query, options = {}) {
  const { category, tradition, limit = 3 } = options;
  let candidates = [...FULL_DATASET];

  if (category) {
    candidates = candidates.filter((item) => item.category === category);
  }
  if (tradition) {
    candidates = candidates.filter((item) =>
      item.tradition.toLowerCase().includes(tradition.toLowerCase())
    );
  }

  if (query) {
    const keywords = query.toLowerCase().split(/\s+/);
    candidates = candidates
      .map((item) => {
        const searchable = `${item.title} ${item.text} ${item.teaching} ${item.keywords.join(' ')}`.toLowerCase();
        const score = keywords.reduce((sum, kw) => sum + (searchable.includes(kw) ? 1 : 0), 0);
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  } else {
    // Random selection if no query
    candidates.sort(() => Math.random() - 0.5);
  }

  return candidates.slice(0, limit);
}
