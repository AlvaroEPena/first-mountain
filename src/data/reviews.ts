/**
 * Google reviews for First Mountain Construction, captured 2026-10-14 (source: docs/google-reviews.md).
 * Brief decision: show every 4★/5★ review with text. The two 1★ reviews and one rating-only review
 * are left out, and review r27 is trimmed (no prices or supplier names). Obvious typos are fixed
 * (e.g. "pored", "dissapointed") and photo references removed; wording is otherwise verbatim.
 * Rendered as visible content only. No Review/AggregateRating JSON-LD (Google policy, research Q5).
 */
import type { ServiceId } from './service-ids';

export interface Review {
  id: string;
  /** Public display: first name and last initial (full names stay in docs/google-reviews.md). */
  displayName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Approximate year, derived from Google's relative date at capture. */
  approxYear: number;
  localGuide: boolean;
  text: string;
  /** Short pull quote: a verbatim substring of `text` (first letter may be capitalized). */
  highlight?: string;
  ownerReply?: string;
  /** Extra attribution line (e.g. a company name the reviewer signed with). */
  attribution?: string;
  services: ServiceId[];
}

export const reviewsCapturedOn = '2026-10-14';

export const reviews: readonly Review[] = [
  {
    id: 'r00',
    displayName: 'Scott R.',
    rating: 5,
    approxYear: 2026,
    localGuide: true,
    text: `Over the past 4 years I've had Frank and his crew do several projects. He and his team have done a basketball court, a driveway and in this recent one pavers, edging and a concrete wall. They have always done an excellent job. I would definitely recommend him.`,
    highlight: `They have always done an excellent job.`,
    services: ['sport-courts', 'driveways', 'hardscape', 'retaining-walls'],
  },
  {
    id: 'r01',
    displayName: 'Doug F.',
    rating: 5,
    approxYear: 2026,
    localGuide: true,
    text: `Frank did us a great job, he showed up with a crew they outlined the driveway, he made it more exotic than what we were even planning or thinking, and then the end result is far better than what I had imagined, sometimes in life you find things and they turn out better than you expect, well this is one of them. Frank did us a great job and it increased the wow factor of the front of our house.`,
    highlight: `Frank did us a great job and it increased the wow factor of the front of our house.`,
    services: ['driveways'],
  },
  {
    id: 'r02',
    displayName: 'Robert B.',
    rating: 5,
    approxYear: 2026,
    localGuide: false,
    text: `We love Frank and his crew! They are very fast and efficient and are reasonably priced. They have extended our backyard cement patio twice and we had it extended around to the side of our home as well. Frank and his crew even went above and beyond for us by helping us setup the areas prior to work being done (move heavy equipment, etc.), as well as great cleanup afterwards. We also had them repurpose some old blocks to level out a section of hedging in front of our house. Highly recommend their work!`,
    highlight: `They are very fast and efficient and are reasonably priced.`,
    services: ['patios-pads', 'hardscape'],
  },
  {
    id: 'r03',
    displayName: 'Jonathan B.',
    rating: 5,
    approxYear: 2025,
    localGuide: true,
    text: `We are SO happy with the work Frank and his crew did at our house. We had them pour a 62x32 pickleball pad and it turned out great. We chose to do a 5” slab with rebar and a vapor barrier. Frank kept us in the loop and worked around our schedule. He was very helpful in thinking through the design and best way to lay things out. It helped that Frank also loves pickleball! We are waiting until spring to have it painted, but I’ve included photos of our process. I highly recommend First Mountain Construction!`,
    highlight: `We had them pour a 62x32 pickleball pad and it turned out great.`,
    services: ['sport-courts'],
  },
  {
    id: 'r04',
    displayName: 'Mike M.',
    rating: 5,
    approxYear: 2026,
    localGuide: false,
    text: `As a contractor myself, I can attest to the fact that there are very few concrete contractors that do what Frank Mounga of First Mountain Construction does for me and my customers. Not only do I use him as a subcontractor, with great success and very satisfied customers, but he has done multiple projects for me personally, all of which have been outstanding. If you want the very best work done at a price that is unrivaled, please call Frank. You won't be disappointed!!`,
    highlight: `If you want the very best work done at a price that is unrivaled, please call Frank.`,
    attribution: 'Dynasty Decks',
    services: [],
  },
  {
    id: 'r05',
    displayName: 'Dan D.',
    rating: 5,
    approxYear: 2026,
    localGuide: false,
    text: `Highly recommended! Very competitive in their pricing, but also high quality work. I was very impressed. They took the extra time needed to do the work and do it right. They didn't cut corners. Fast and efficient, yet quality. I'm extremely happy with how it turned out and would use them again.`,
    highlight: `They took the extra time needed to do the work and do it right. They didn't cut corners.`,
    services: ['driveways'],
  },
  {
    id: 'r06',
    displayName: 'Parrish C.',
    rating: 5,
    approxYear: 2024,
    localGuide: true,
    text: `We had Frank and his crew come over, bid was fair and when we made changes the next day he was quick to update the bid. The new driveway and front porch looks amazing. Had the right crew and they worked hard. Answered all of our questions and even fixed a few things the engineer missed. Would use him again.

Update: Well here we are three years later and the driveway porch and pad are amazing. We asked Frank back for a new pad in the back corner of our lot and once again Frank was great to work with. I know it was a challenge to get right because of the slope of our property and access to it, but his attention to detail and hard work paid off. Loving the new slab!`,
    highlight: `Here we are three years later and the driveway porch and pad are amazing.`,
    services: ['driveways', 'steps-walkways', 'patios-pads'],
  },
  {
    id: 'r07',
    displayName: 'Noah Z.',
    rating: 5,
    approxYear: 2025,
    localGuide: true,
    text: `Frank came out and gave me a quote in 2021. He was the only concrete company that was willing to come in person and review the job site in person. That stood out to me and when I met him I knew he was the kind of person I wanted to do business with. He was on time, he was thorough, and he was transparent about what was included vs. what would cost more. Fast forward a year and called him back as I was ready to pull the trigger on my driveway. He came back to provide an updated estimate and I then committed to the job. Once he told me the date he was going to start working, everything was done as he said it would be and the concrete driveway turned out amazing. No damage to my house or yard and the communication along the way was great.

Update: First Mountain and Frank came back out and poured an add on to our driveway. Zero cracks in the driveway to date and the add on is a piece of artwork. Another reasonable bid, on time, and probably quicker than I expected. Frank is the best in the business and just an amazing guy, don’t waste your time or money going with anyone else!`,
    highlight: `Zero cracks in the driveway to date and the add on is a piece of artwork.`,
    services: ['driveways'],
  },
  {
    id: 'r08',
    displayName: 'Karl B.',
    rating: 5,
    approxYear: 2023,
    localGuide: false,
    text: `Frank was amazing to work with. He came right out the same day to give me a bid. His price was great and the work was as well. He was able to start the job quickly, when promised, and finished on time. He demolished our old front steps and walkway, framed everything out, added rebar and poured new concrete. The result is amazing and is definitely the highlight of the front of the house. He was even careful enough to save our front metal awning and supports. First Mountain Construction is the first and only call I'll make when it's time to do the driveway.`,
    highlight: `He came right out the same day to give me a bid.`,
    services: ['steps-walkways'],
  },
  {
    id: 'r09',
    displayName: 'Greg S.',
    rating: 5,
    approxYear: 2021,
    localGuide: true,
    text: `Concrete RV Pad. I do a lot of research before giving my business to anyone. Frank and his team won me over. They quoted very competitive and Frank was one of the few people who came out to give me a quote. He stuck to his quote and didn’t try raising the price with hidden fees or incremental labor like many of the other places did.

Quick: once I made the decision to go with Frank he was onsite within a week and had everything done in two days including excavation, pouring, and finishing. He came back a few days after it had set up and made sure no debris was left on my property. They didn’t dump excess cement in our yard and were a very nice group of guys doing the work.

We are super happy with the finished project and Frank is a great guy so happy to support his business.`,
    highlight: `He stuck to his quote and didn’t try raising the price with hidden fees or incremental labor`,
    services: ['rv-pads'],
  },
  {
    id: 'r10',
    displayName: 'Brian S.',
    rating: 5,
    approxYear: 2025,
    localGuide: false,
    text: `They did excellent work. They showed when they were scheduled and completed the job in one day, including grass removal and ground prep! Great price for the job, too. I would definitely hire them again.`,
    highlight: `They showed when they were scheduled and completed the job in one day.`,
    services: ['patios-pads'],
  },
  {
    id: 'r11',
    displayName: 'Harold S.',
    rating: 5,
    approxYear: 2026,
    localGuide: true,
    text: `My wife found this company online. Frank showed up when he said he would to measure and provide a quote. His quote was 2nd out of 3. We are glad we chose him as his work was very good.`,
    services: [],
  },
  {
    id: 'r12',
    displayName: 'Benjamin Z.',
    rating: 5,
    approxYear: 2025,
    localGuide: true,
    text: `I recently had my concrete driveway replaced by Frank and his team, and I couldn’t be more pleased with the results. From start to finish, they were honest, professional, and reliable. The quality of the workmanship is outstanding. The driveway looks fantastic and has really improved the curb appeal of my home.

What truly stood out was the extra effort they put in. Not only did they complete the driveway but they also went above and beyond by doing some additional landscape work to ensure everything looked clean and seamless. It's rare to find a team that takes such pride in their work and genuinely cares about the finished product. I highly recommend Frank and his crew for any concrete or outdoor work. You can trust them to do the job right.`,
    highlight: `The driveway looks fantastic and has really improved the curb appeal of my home.`,
    services: ['driveways', 'hardscape'],
  },
  {
    id: 'r13',
    displayName: 'Corey F.',
    rating: 5,
    approxYear: 2025,
    localGuide: true,
    text: `Frank spent the last 4 days working at my house. He is a really funny guy. He got all of the details done. My place looks so good. He added extra drains in the concrete and made the drive nice and wide for easy trailer parking. He was able to work around the old concrete and even cut out some of the bad spots. Frank is super smart and can see what you are trying to accomplish with your concrete projects. 5 stars all the way!`,
    highlight: `He added extra drains in the concrete and made the drive nice and wide for easy trailer parking.`,
    services: ['driveways', 'rv-pads', 'hardscape'],
  },
  {
    id: 'r14',
    displayName: 'Michelle S.',
    rating: 5,
    approxYear: 2022,
    localGuide: false,
    text: `Frank and his crew were awesome guys! Stayed true to the quote! They came, they tore apart, they formed the area, then poured the concrete! And made sure there was no mess left behind! The concrete looks beautiful! Fast, efficient and nice people! Would definitely recommend to anyone that needs concrete!!`,
    highlight: `Stayed true to the quote!`,
    services: [],
  },
  {
    id: 'r15',
    displayName: 'Brian M.',
    rating: 5,
    approxYear: 2026,
    localGuide: false,
    text: `Frank is fantastic! The team delivered perfection! Can’t say enough good things.`,
    highlight: `The team delivered perfection!`,
    services: [],
  },
  {
    id: 'r16',
    displayName: 'Jacob B.',
    rating: 5,
    approxYear: 2025,
    localGuide: false,
    text: `Frank and his crew did an amazing job on extending our driveway, adding a side pathway and a concrete pad in our backyard. Their work is top notch! They're super pleasant to work with. He also came later and installed some excellent custom window well covers his neighbor makes and charged us nothing for the installation. He's the best!`,
    highlight: `Their work is top notch!`,
    ownerReply: `It was a pleasure working with you Jacob! Thank you for the review!`,
    services: ['driveways', 'steps-walkways', 'patios-pads'],
  },
  {
    id: 'r17',
    displayName: 'Brandi B.',
    rating: 5,
    approxYear: 2025,
    localGuide: true,
    text: `Frank and his team does amazing work! They just poured a 130ft retaining wall for me in my backyard. They even backfilled it all nice and level and then installed the fence on top of the wall. It looks amazing and we couldn’t be happier. We will definitely be hiring them for our future projects.`,
    highlight: `They just poured a 130ft retaining wall for me in my backyard.`,
    services: ['retaining-walls', 'fences'],
  },
  {
    id: 'r18',
    displayName: 'Brittany N.',
    rating: 5,
    approxYear: 2025,
    localGuide: false,
    text: `These guys are the best. They are our go-to business for any landscaping needs. Frank and his crew are timely, honest, reasonably priced, and have a broad array of skills. Over the years they have poured our patio, put in paths, created a playground area, fixed our fence, put up posts in our yard, put in a rock area for a shed...they are very easy to work with and the outcome is always top-notch. Highly recommend.`,
    highlight: `Frank and his crew are timely, honest, reasonably priced, and have a broad array of skills.`,
    services: ['patios-pads', 'steps-walkways', 'hardscape', 'fences'],
  },
  {
    id: 'r19',
    displayName: 'Jason C.',
    rating: 5,
    approxYear: 2024,
    localGuide: true,
    text: `Frank and his team were great to work with. We had kind of a unique scenario where our neighbor was getting concrete poured next to our driveway. We talked with Frank about doing part of our yard that connect with what they were already pouring. Within a week of talking with him we had a new pad poured that looked beautiful. They did all of the prep work, poured, and finished within 2 working days. Pad size was about 8’x30’. I thought that the estimate I was given was a fair price for the work being done. Frank communicated everything well and was on time and finished on time.`,
    highlight: `They did all of the prep work, poured, and finished within 2 working days.`,
    services: ['patios-pads'],
  },
  {
    id: 'r21',
    displayName: 'Manil S.',
    rating: 5,
    approxYear: 2025,
    localGuide: false,
    text: `Frank and his crew did a wonderful job on our new fence for our house. He did a good job of communicating the time frame of the work to be completed and even finished the job early. Good quality work at a competitive price, all we asked for and more.`,
    highlight: `Good quality work at a competitive price, all we asked for and more.`,
    services: ['fences'],
  },
  {
    id: 'r22',
    displayName: 'Rodmehr S.',
    rating: 5,
    approxYear: 2025,
    localGuide: true,
    text: `Frank and his crew did a great job making a smooth concrete hold for us to ensure the fence doesn't get dug under. He's professional, prompt, and all around a pleasure to work with.`,
    highlight: `He's professional, prompt, and all around a pleasure to work with.`,
    services: ['fences', 'hardscape'],
  },
  {
    id: 'r23',
    displayName: 'Tiffany A.',
    rating: 5,
    approxYear: 2025,
    localGuide: false,
    text: `Frank and his crew did a great job digging out my old red brick patio and replacing with concrete. I’m very pleased with how it turned out. He surprised me by taking some extra material and putting a rock border around my garden. It’s nice when someone goes the extra mile like that.`,
    highlight: `It’s nice when someone goes the extra mile like that.`,
    services: ['patios-pads', 'hardscape'],
  },
  {
    id: 'r24',
    displayName: 'Rachel M.',
    rating: 5,
    approxYear: 2021,
    localGuide: false,
    text: `Frank did our concrete and I loved how it turned out! I felt like he was a humble, genuine, honest and kind man that we could trust. We had several people come out and quote us but felt like Frank was going to do the best job and not sneak in any hidden fees. SO happy we chose him! Great experience! Would recommend to everyone.`,
    highlight: `A humble, genuine, honest and kind man that we could trust.`,
    services: [],
  },
  {
    id: 'r26',
    displayName: 'Brett B.',
    rating: 5,
    approxYear: 2023,
    localGuide: false,
    text: `Extremely prompt, communicative, and excellent job. Couldn’t ask for more. Thanks!`,
    highlight: `Extremely prompt, communicative, and excellent job.`,
    services: [],
  },
  {
    id: 'r27',
    displayName: 'Michael O.',
    rating: 4,
    approxYear: 2026,
    localGuide: true,
    text: `Good job, good price. You'll be every bit as satisfied as I was. My project was 12'x20' including a little pad for my garbage cans. Got three footings in the slab for a future deck above the slab. Broom finish but was offered a stamped border. Good slope for drainage. I would genuinely hang out with these guys. They've got good hearts, they're showing up and they're getting stuff done. You should call them and get some concrete work!`,
    highlight: `They've got good hearts, they're showing up and they're getting stuff done.`,
    services: ['patios-pads', 'hardscape'],
  },
  {
    id: 'r28',
    displayName: 'Gavin R.',
    rating: 5,
    approxYear: 2026,
    localGuide: false,
    text: `I used First Mountain Construction to extend our driveway and xeriscape our yard. They were easy to communicate with and finished the work quickly. We had a few sprinkler issues afterward, but they came back promptly and resolved everything. Overall, I’d recommend them!`,
    highlight: `They were easy to communicate with and finished the work quickly.`,
    services: ['driveways', 'hardscape'],
  },
];

export function reviewsForService(service: ServiceId): Review[] {
  return reviews.filter((review) => review.services.includes(service));
}
