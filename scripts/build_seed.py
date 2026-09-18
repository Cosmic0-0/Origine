"""
Build site/src/seed/seed.ndjson: every document the site needs, in Sanity's own format.

The same file is imported into Sanity with `sanity dataset import` on first deploy, so the
content lives in exactly one place. Images are referenced as image@file:// paths relative
to this file; the local build resolves them from src/seed/images and the import uploads them.
"""
import json, sys, os, re
from datetime import datetime, timezone
sys.path.insert(0, os.path.dirname(__file__))
from html_to_portable_text import convert, from_text, key

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRATCH = sys.argv[1] if len(sys.argv) > 1 else None  # scratchpad/content dir with blog.json and faq.json
OUT = os.path.join(ROOT, 'site', 'src', 'seed', 'seed.ndjson')

def L(en, fr=None):
    return {'en': en, **({'fr': fr} if fr else {})}

def LB(blocks):
    return {'en': blocks}

def photo(name, alt, hotspot=None):
    p = {'_type': 'photo', '_sanityAsset': f'image@file://./images/{name}', 'alt': alt}
    if hotspot:
        p['hotspot'] = {'_type': 'sanity.imageHotspot', 'x': hotspot[0], 'y': hotspot[1], 'height': 0.6, 'width': 0.6}
    return p

def ref(id_):
    return {'_type': 'reference', '_ref': id_, '_key': key()}

def keyed(obj):
    return {'_key': key(), **obj}

docs = []

# ---------------------------------------------------------------- settings
docs.append({
    '_id': 'siteSettings', '_type': 'siteSettings',
    'siteName': 'Origine Healing', 'practitionerName': 'Stephanie Maurel',
    'tagline': L('Embodied healing in the north of Mauritius and online.'),
    'email': 'caellumbuys@gmail.com',
    'whatsapp': '+23052520605',
    'address': {'venue': 'Domaine de Labourdonnais', 'town': 'Mapou', 'region': 'Rivière du Rempart', 'country': 'Mauritius',
                'mapUrl': 'https://maps.google.com/?q=Domaine+de+Labourdonnais+Mapou+Mauritius'},
    'calendlyUrl': 'https://calendly.com/stephanie-origine/60mins',
    'youtubeUrl': 'https://www.youtube.com/@OrigineMeditations',
    'instagramUrl': 'https://instagram.com/stephaniemaurel',
    'facebookUrl': 'https://facebook.com/stephmaurel',
    'replyPromise': L('I reply within one business day.'),
    'cancellationPolicy': L('Please give at least 24 hours’ notice to reschedule or cancel a session. Late cancellations are charged in full, because the time cannot be offered to someone else at short notice.'),
    'photoCredit': 'Photography by Sita Kelly Photography',
    'defaultSeo': {
        'description': L('Stephanie Maurel offers embodied healing sessions and a three-month programme in Mapou, Mauritius, and online. Twenty years of clinical Pilates and occupational therapy, plus energy work, hypnotherapy and shamanic practice.'),
        'image': photo('beach-portrait.jpg', 'Stephanie Maurel on a beach in the north of Mauritius at dusk'),
    },
})

# ---------------------------------------------------------------- modalities
modalities = [
    ('access-bars', 'Access Bars',
     'A gentle, hands-on reset. Light touch on 32 points on the head, to let go of stress, repetitive patterns and mental clutter.',
     """Access Bars is a hands-on method that uses a light touch on 32 points on the head. These points relate to areas of life like stress, money, creativity, the body, and more. When they are lightly held, built-up mental and emotional tension can release, inviting more ease, clarity and calm.

## What to expect in a session

- A fully clothed, relaxing session on a massage table
- Gentle touch, no pressure, massage or manipulation
- Many people feel lighter afterwards, sleep better, and find decisions easier

## Who it can help

- Anyone feeling stressed, overwhelmed or stuck
- People wanting more mental space, focus and creativity
- Anyone who needs to unwind, rest and reset

As an Access Bars facilitator, I offer sessions that create space for your nervous system to soften and your mind to quiet, so you can feel more present, clear and at ease. Four sessions is a good number to work with if you want a lasting shift.""",
     ['inPerson'], (60, 75), 'post-access-bars', 1),
    ('reiki', 'Reiki',
     'Japanese energy healing for stress reduction and deep relaxation, through the laying on of hands.',
     """Reiki is a Japanese energy healing technique for stress reduction and relaxation. It involves the laying on of hands to channel life-force energy, with the aim of balancing the body’s energy, supporting emotional wellbeing, and helping the natural healing of mind, body and spirit.

Sessions are in person, fully clothed, lying on a massage table. Most people find it deeply restful. Some notice warmth or tingling, some fall asleep, and some simply feel quieter afterwards. All of that is fine.""",
     ['inPerson'], (60, 75), None, 2),
    ('rebirthing-breathwork', 'Rebirthing breathwork',
     'A conscious, connected breathing practice that lets what is held in the body surface, move and settle.',
     """Rebirthing breathwork is a gentle, conscious connected breathing practice where the inhale and exhale are merged without pauses. The relaxed, continuous rhythm brings on a safe and deep relaxation, and in that expanded state we can reach unconscious thoughts, fears, blockages and old experiences, so that emotions and memories can surface, integrate and heal while you feel safe.

It was developed by Leonard Orr in the late 1960s and 1970s within the transpersonal and somatic traditions. It is a complementary mind-body practice, not a medical treatment.

## What a session looks like

We start with a check-in on your intentions and a short questionnaire that helps us find the limiting belief behind your present situation. You then lie down comfortably and I guide a gentle, continuous nasal breath. You may notice physical sensations or emotions as the energy cycle unfolds. The session completes when a sense of calm, ease or bliss arrives, and we finish with affirmations and gratitude.

Sessions run around 90 minutes. Ten sessions is the traditional course, and it is where the deepest work happens, but a single session is a fine way to find out whether it is for you. Available in person and online.""",
     ['inPerson', 'online'], (90, 90), 'post-rebirthing-breathwork', 3),
    ('embodiment-coaching', 'Embodiment coaching',
     'Coaching that includes the body: posture, breath, movement and sensation, so change goes deeper than insight.',
     """Embodiment coaching moves beyond traditional talk coaching by bringing in the body’s wisdom. We use posture, breath, movement and somatic awareness to notice ingrained patterns, work with emotions, and support lasting change, treating the body as an active participant rather than a vessel.

This is also where spiritual coaching sits. A session starts with a conversation about where you are and what you want, and from there we go where it needs to go. Some sessions are mostly talking. Some become mostly breath and body. Available in person and online, weekly or fortnightly.""",
     ['inPerson', 'online'], (60, 75), None, 4),
    ('ericksonian-hypnotherapy', 'Ericksonian hypnotherapy',
     'A gentle, conversational hypnotherapy that works with your own resources rather than direct commands.',
     """Ericksonian hypnotherapy is a permissive, indirect approach developed by Dr Milton Erickson. It uses metaphor, story and conversational language to work around the conscious mind’s resistance, and draws on your own strengths and unconscious resources to bring about personal, often rapid, change.

There is nothing theatrical about it. You stay aware and in control throughout. It is well suited to old patterns, anxiety, and the beliefs that sit underneath a problem. Available in person and online.""",
     ['inPerson', 'online'], (60, 75), None, 5),
    ('shamanic-meditation', 'Shamanic journeys and meditation',
     'Guided journeys drawing on North American and South African shamanic traditions, and the medicine wheel.',
     """Shamanic journeying is a guided, meditative practice for going inward: to meet what is asking for attention, to retrieve what has been lost, and to come back with something to live by. I trained in both North American and South African traditions and hold this work with great respect for where it comes from.

In one-to-one work it appears inside the three-month programme and in spiritual coaching sessions. In groups it is the heart of the monthly Moonlight Meditation and the shamanic circles. You do not need to believe anything to take part. You only need to be willing to explore your own experience.""",
     ['inPerson', 'online'], None, None, 6),
]
for slug, title, summary, body, where, dur, post_id, order in modalities:
    d = {'_id': f'modality-{slug}', '_type': 'modality', 'title': L(title), 'slug': {'_type': 'slug', 'current': slug},
         'summary': L(summary), 'body': LB(from_text(body)), 'where': where, 'order': order}
    if dur: d['durationMinutes'] = {'min': dur[0], 'max': dur[1]}
    if post_id: d['relatedPost'] = {'_type': 'reference', '_ref': post_id}
    docs.append(d)

# ---------------------------------------------------------------- services (offers)
docs.append({
    '_id': 'service-single-session', '_type': 'service', 'title': L('A single session'), 'slug': {'_type': 'slug', 'current': 'single-session'},
    'kind': 'session',
    'summary': L('One modality, chosen with you: Access Bars, Reiki, rebirthing breathwork, embodiment coaching or Ericksonian hypnotherapy. Or a spiritual coaching session that starts with a conversation and goes where it needs to. This is where most people begin.'),
    'body': LB(from_text("""Book one session, or a package of weekly sessions. If you are not sure which modality to choose, book a session and we will work it out together in the first ten minutes. Sessions happen seated, on a massage table or on the floor depending on the modality, and when we can, outside: in the garden, on the beach, in the forest.""")),
    'includes': [keyed(L('60 to 75 minutes, one to one')), keyed(L('One modality, chosen together')), keyed(L('In person at Domaine de Labourdonnais, or online'))],
    'image': photo('portrait-15.jpg', 'Stephanie standing at the shore at dusk, hands resting on her chest', (0.6, 0.5)),
    'price': {'amount': 3000, 'currency': 'MUR'},
    'durationMinutes': {'min': 60, 'max': 75},
    'where': ['inPerson', 'online'],
    'modalities': [ref('modality-access-bars'), ref('modality-reiki'), ref('modality-rebirthing-breathwork'), ref('modality-embodiment-coaching'), ref('modality-ericksonian-hypnotherapy')],
    'booking': {'mode': 'calendly'},
    'showOnHome': True, 'order': 1,
})
docs.append({
    '_id': 'service-programme', '_type': 'service', 'title': L('The three-month programme'), 'slug': {'_type': 'slug', 'current': 'three-month-programme'},
    'kind': 'programme',
    'summary': L('Twelve weeks, one session a week, drawing on everything I practise. Between sessions you have me by text and email, recorded meditations to work with, and a place at the monthly Moonlight Meditation. It asks for a full three months, because that is how long real change takes to settle.'),
    'body': LB(from_text("""A deeply held container for transformation. Each week we meet for 60 to 90 minutes and work with whatever is most alive: Reiki, Access Bars, hypnotherapy, shamanic journeys, embodiment coaching, breathwork, meditation. Over three months this builds resilience, releases chronic patterns, steadies emotional regulation, and brings you back into your body.

The programme requires a full three-month commitment. Payment plans are available. Write to me first and we will talk it through before you decide.""")),
    'includes': [keyed(L('Twelve weekly sessions of 60 to 90 minutes')), keyed(L('Text and email support between sessions')), keyed(L('Recorded meditations to work with at home')), keyed(L('A place at each monthly Moonlight Meditation')), keyed(L('Payment plans available'))],
    'image': photo('indoor-teal.jpg', 'Stephanie seated in her practice room in a teal jumper, hands folded'),
    'price': {'amount': 44000, 'currency': 'MUR', 'note': L('Payment plans available')},
    'durationMinutes': {'min': 60, 'max': 90},
    'frequency': L('Weekly for three months'),
    'where': ['inPerson', 'online'],
    'modalities': [ref('modality-reiki'), ref('modality-access-bars'), ref('modality-ericksonian-hypnotherapy'), ref('modality-shamanic-meditation'), ref('modality-embodiment-coaching'), ref('modality-rebirthing-breathwork')],
    'booking': {'mode': 'enquire', 'label': L('Enquire about the programme')},
    'showOnHome': True, 'order': 2,
})
docs.append({
    '_id': 'service-moonlight', '_type': 'service', 'title': L('Moonlight Meditation'), 'slug': {'_type': 'slug', 'current': 'moonlight-meditation'},
    'kind': 'group',
    'summary': L('A monthly evening of guided meditation drawing on shamanic wisdom and the medicine wheel. A small group, a quiet room, nervous systems settling in each other’s company.'),
    'body': LB(from_text("""Once a month we sit together, in person, for two to three hours. The evening is framed around co-regulation: the way nervous systems settle when they are in good company. We work with the medicine wheel and shamanic wisdom, and close with tea. No experience needed. Wear something warm and comfortable.""")),
    'image': photo('portrait-9.jpg', 'Stephanie seated in the garden, smiling, holding a frame drum', (0.5, 0.35)),
    'price': {'amount': 1500, 'currency': 'MUR'},
    'durationMinutes': {'min': 120, 'max': 180},
    'frequency': L('Once a month'),
    'where': ['inPerson'],
    'modalities': [ref('modality-shamanic-meditation')],
    'booking': {'mode': 'enquire', 'label': L('Reserve a place')},
    'showOnHome': False, 'order': 3,
})
docs.append({
    '_id': 'service-online-meditations', '_type': 'service', 'title': L('Weekly online meditations'), 'slug': {'_type': 'slug', 'current': 'online-meditations'},
    'kind': 'free',
    'summary': L('Meditation as medicine. A free guided meditation every week, online, to support your nervous system between sessions or as a place to start.'),
    'price': {'amount': 0, 'currency': 'MUR'},
    'frequency': L('Weekly'),
    'where': ['online'],
    'modalities': [ref('modality-shamanic-meditation')],
    'booking': {'mode': 'link', 'url': 'https://www.youtube.com/@OrigineMeditations', 'label': L('Watch on YouTube')},
    'showOnHome': False, 'order': 4,
})
docs.append({
    '_id': 'service-retreats', '_type': 'service', 'title': L('Nature-based retreats'), 'slug': {'_type': 'slug', 'current': 'retreats'},
    'kind': 'retreat',
    'summary': L('Three to five days of slowing down, clearing old belief patterns, embodied movement and soul retrieval, somewhere beautiful. Dates and prices are announced by email first.'),
    'body': LB(from_text("""Mind, body and soul retreats. An immersive few days away from your usual life to slow down, reconnect, clear the patterns that keep you stuck, move, and retrieve the wisdom of your own soul. Each retreat is different, so the price depends on the retreat. Join the list below to hear about the next one.""")),
    'image': photo('curtains-trees.jpg', 'Sheer curtains moving in front of trees'),
    'price': {'note': L('Price depends on the retreat')},
    'durationMinutes': None,
    'where': ['inPerson'],
    'booking': {'mode': 'enquire', 'label': L('Ask about the next retreat')},
    'showOnHome': False, 'order': 5,
})
docs.append({
    '_id': 'service-workshops', '_type': 'service', 'title': L('Day workshops, drum circles and shamanic circles'), 'slug': {'_type': 'slug', 'current': 'workshops-and-circles'},
    'kind': 'workshop',
    'summary': L('Occasional one-day gatherings: workshops, drum circles and shamanic circles. Dates appear here and go out to the list.'),
    'where': ['inPerson'],
    'booking': {'mode': 'enquire'},
    'showOnHome': False, 'order': 6,
})
for d in docs:
    if d.get('_type') == 'service' and d.get('durationMinutes') is None:
        d.pop('durationMinutes', None)

# ---------------------------------------------------------------- events (one placeholder date so the layout can be seen)
docs.append({
    '_id': 'event-moonlight-2026-10', '_type': 'event', 'title': L('Moonlight Meditation, October'), 'slug': {'_type': 'slug', 'current': 'moonlight-meditation-october-2026'},
    'offer': {'_type': 'reference', '_ref': 'service-moonlight'},
    'start': '2026-10-03T19:00:00+04:00', 'end': '2026-10-03T22:00:00+04:00',
    'location': L('Domaine de Labourdonnais, Mapou'),
    'booking': {'mode': 'enquire', 'label': L('Reserve a place')},
})

# ---------------------------------------------------------------- testimonials
for i, (name, quote, ctx) in enumerate([
    ('Lauren H', 'You create a very gentle, grounded space to land. I’ve felt safe, deeply heard, and genuinely seen, which allowed real shifts to happen rather than just surface-level insight.', None),
    ('Philippe LV', 'After the very first Access Bars session, I felt very aligned and grounded and strong. Ready to take on challenges. I felt expansive.', 'Access Bars'),
    ('Delphine', 'The rebirthing breathwork helped me let go of stress that I was holding onto with a particular situation and I’m now able to move forward.', 'Rebirthing breathwork'),
    ('Lauren', 'Through the different modalities I’ve experienced with you, I’ve always left feeling more connected to my body, my breath, and my emotions. The meditation journeys, rebirth breathing, coaching sessions, and Access Bars each opened something different, but the common thread was reconnection and regulation.', None),
], 1):
    d = {'_id': f'testimonial-{i}', '_type': 'testimonial', 'quote': L(quote), 'name': name, 'featured': i in (1, 4), 'order': i}
    if ctx: d['context'] = L(ctx)
    docs.append(d)

# ---------------------------------------------------------------- FAQ (migrated, deduplicated, lightly tidied)
faq_topics = {
    'What is Origine Healing?': 'about', 'What services do you offer?': 'about', 'What makes you different?': 'about', 'Is this therapy?': 'about',
    'Do I need to be spiritual for this work?': 'about', 'What kinds of issues do you work with?': 'about', 'How do I know if this is right for me?': 'about',
    'What can I expect from a session?': 'sessions', "What's it like to work with you?": 'sessions', 'How do I prepare for a session?': 'sessions',
    'What happens after a session?': 'sessions', 'How many sessions will I need?': 'sessions',
    'How do I get started?': 'booking', 'How can I contact you?': 'booking', 'What are your rates?': 'booking', 'What is your cancellation policy?': 'booking',
}
if SCRATCH:
    faq = json.load(open(os.path.join(SCRATCH, 'faq.json')))
    seen = set(); order = 0
    for item in faq:
        q = item['q'].strip().replace('What are you rates?', 'What are your rates?')
        if q in seen: continue
        seen.add(q); order += 1
        html = item['a_html']
        # Squarespace "Get Started" page no longer exists: point those links at the new pages.
        html = html.replace('/get-started', '/work-with-me').replace('/faq-1', '/faq')
        blocks = convert(html)
        docs.append({'_id': f'faq-{order}', '_type': 'faqEntry', 'question': L(q), 'answer': LB(blocks), 'topic': faq_topics.get(q, 'about'), 'order': order})

# ---------------------------------------------------------------- blog posts (migrated)
post_meta = {
    'blog_rebirthing-breathwork': ('post-rebirthing-breathwork', 'rebirthing-breathwork', '2026-04-14T09:00:00+04:00', 'blog-rebirthing.jpg', 'Two people lying on cushions during a breathwork and sound session, with singing bowls',
        'What rebirthing breathwork is, where it comes from, who it is for, and what a session looks like.', 'modality-rebirthing-breathwork'),
    'blog_this-morning-routine-will-change-your-mood': ('post-morning-routine', 'morning-routine-mood', '2020-08-07T09:00:00+04:00', 'blog-morning.jpg', 'A bright dining nook with vases, plates and fruit on the table',
        'How you begin your morning shapes your mood, your energy and your inner world. A gentle routine to support your nervous system.', None),
    'blog_the-beginners-guide-to-meditation-c477r': ('post-beginners-guide-meditation', 'beginners-guide-to-embodied-meditation', '2020-08-05T09:00:00+04:00', 'blog-meditation.jpg', 'Waves breaking on rocks on a Mauritian beach',
        'Meditation does not ask you to silence your mind. Start with the body instead. A beginner’s guide to embodied meditation.', 'modality-shamanic-meditation'),
    'blog_access-bars': ('post-access-bars', 'access-bars', '2020-08-04T09:00:00+04:00', 'blog-access-bars.jpg', 'A woman resting on a couch, smiling',
        'Access Bars: a gentle, hands-on reset for mind and body. What to expect and who it can help.', 'modality-access-bars'),
}
if SCRATCH:
    blog = json.load(open(os.path.join(SCRATCH, 'blog.json')))
    for k, v in blog.items():
        pid, slug, date, img, alt, excerpt, mod = post_meta[k]
        html = v['html'] or ''
        # strip Squarespace image wrappers and the trailing author line
        blocks = [b for b in convert(html) if not (b.get('children') and len(b['children']) == 1 and b['children'][0]['text'].strip() in ('Stephanie Maurel', ''))]
        d = {'_id': pid, '_type': 'post', 'title': L(v['title']), 'slug': {'_type': 'slug', 'current': slug}, 'publishedAt': date,
             'excerpt': L(excerpt), 'coverImage': photo(img, alt), 'body': LB(blocks)}
        if mod: d['relatedModality'] = {'_type': 'reference', '_ref': mod}
        docs.append(d)

# ---------------------------------------------------------------- pages
docs.append({
    '_id': 'homePage', '_type': 'homePage',
    'heroHeading': L('Healing is a return, not a repair.'),
    'heroLede': L('Embodied healing in the north of Mauritius and online, for people who have done some of the work already and want the rest of themselves to come along.'),
    'heroImage': photo('beach-portrait.jpg', 'Stephanie Maurel on a beach in the north of Mauritius at dusk, in a white dress and pale pink shawl', (0.5, 0.25)),
    'credentialsLine': L('Twenty years of clinical and rehabilitative Pilates and an occupational therapy background, then hypnotherapy, embodiment coaching and shamanic training. All of it in the room with you.'),
    'statement': L('Healing is not about fixing what is broken. It is about returning to what is already whole within you.'),
    'originMeaning': L('Origine is French for origin. I use it to mean a return to your natural state of being. The work is respectful, embodied and non-dogmatic, and you do not need to be spiritual for it to help.'),
    'whoHeading': L('Chronic pain. Anxiety. A life in transition.'),
    'whoBody': LB(from_text("""Most people come after talk therapy or bodywork has taken them part of the way. They want something that works with body, mind and spirit at the same time, without having to leave any of them at the door.

You do not need to be spiritual to work with me. Everything is approached in a way that is respectful, embodied and non-dogmatic.""")),
    'whoImage': photo('indoor-teal.jpg', 'Stephanie seated in her practice room, hands folded, in a teal jumper against a stone wall', (0.5, 0.3)),
    'trainingHeading': L('The clinical came first.'),
    'moonHeading': L('Once a month, we sit together.'),
    'moonBody': L('An evening of guided meditation drawing on shamanic wisdom and the medicine wheel. A small group, a quiet room, and nervous systems settling in each other’s company. If you would rather begin at home, the weekly guided meditations are free on YouTube.'),
    'closingHeading': L('Start with one session.'),
    'closingBody': L('You do not need to be certain. If this speaks to you, that is enough to begin. Book a time that suits you, or write to me first and ask anything.'),
})

about_sections = [
    ('A different approach to healing', """My work has always been guided by one question: how do we truly heal, in wholeness, through our entire being, in mind, body and soul?

Healing is not about fixing what is broken. It is about returning to what is already whole within you, and then the broken parts fix themselves.

True healing happens when we include the body, come into right relationship with the nervous system, and gently reconnect with the deeper layers of the self. I support people who are navigating illness or injury, emotional overwhelm, life transitions, or a quiet sense of disconnection from themselves, even when everything looks fine on the outside. This is not surface-level work. This is a return to your origin.""", None),
    ('My path', """My background is both clinical and deeply intuitive.

I began with sports science and psychology, drawn to understanding both the workings of the body and the inner world. Something felt incomplete, so I trained as an occupational therapist, wanting a discipline that treated body and mind as parts of one whole. Even then, I sensed there was more.

In my twenties that curiosity led me into clinical Pilates, where I spent years teaching movement with a strong therapeutic focus. I loved the precision and the intelligence of the body. But working physically with my clients, I kept feeling the deeper emotional and subconscious layers asking to be addressed.

So I followed that thread. Over the years I trained in wellness coaching, NLP and HNLP, Ericksonian hypnotherapy, transpersonal coaching psychology, open awareness practices, Authentic Self-Empowerment and embodiment coaching, and kept exploring subtle energy and consciousness alongside. My path also led me into North American and South African shamanic traditions, which honour the unseen, the ancestral, and the intelligence beyond the rational mind. None of these trainings replaced what came before. Each widened the lens.

After a globally rooted childhood and early adulthood, I felt a quiet call to return to Mauritius, where my parents are from. Coming back was about rooting, raising my child close to nature and family, and building something meaningful within community. For many years I ran a rehabilitative Pilates practice alongside a small holistic coaching practice. Then, after more than twenty years of rehab-based Pilates, I felt the call to a deeper spiritual immersion. Origine is that next chapter.""", 'portrait-15.jpg'),
    ('How I work', """My approach is integrative, intuitive and grounded. Each session is guided by your goals and what you are ready for, and draws on a blend of embodied awareness and somatic guidance, nervous system regulation, subconscious and emotional integration, and energy and shamanic healing practices.

Sessions are structured, but there is no rigid protocol. We listen. We slow down. We work at the pace your body trusts, because lasting healing does not come from force or speed. It comes from safety, awareness and integration.""", None),
    ('What you may experience', """People often come to me feeling stuck in cycles of pain, tension or fatigue; overwhelmed, anxious or dysregulated; disconnected from their body or sense of self; or frustrated after trying many different approaches.

Through our work together, you may begin to experience a more regulated and resilient nervous system, which looks like more energy, aliveness, joy and peace. Relief from chronic tension and pain patterns. Greater emotional clarity and stability. A deeper connection to your body and your own inner guidance. A sense of coming home to yourself.""", None),
    ('The philosophy behind Origine', """Modern life pulls us away from ourselves. We learn to live in our minds while the body holds unprocessed experiences, emotional patterns and energetic imprints that quietly shape how we feel, relate and move through the world. Over time that shows up as chronic tension or pain, emotional overwhelm or numbness, repeating patterns, fatigue, burnout, or a subtle sense of being far from who you really are.

At Origine, healing is approached through embodiment: returning awareness to the body and restoring communication between the physical, emotional, energetic and inner worlds. Rather than forcing change, this supports the natural intelligence of your nervous system and your soul to reorganise at its own pace. When the body feels safe and supported, it knows how to heal.""", 'candles.jpg'),
    ('If you have worked with me before', """If you were part of my Pilates studio, you already know the care, depth and presence I bring to my work. What we explored through movement was never only about strength or alignment. It was also about healing, awareness and reconnection. This next chapter continues that intention, through a different doorway.

My foundation in embodiment and therapeutic practice remains central. The difference is that I now work more directly with energy, subconscious patterns, and the deeper layers that shape physical and emotional experience. You do not need to be spiritual to step into this work. You only need curiosity and a willingness to explore.""", None),
    ('Beyond my professional life', """I am a mother, a lover of nature and animals, and someone who believes deeply in community: in creating spaces where we support one another honestly and compassionately on our healing journeys. Healing, to me, is not a technique. It is a remembering of wholeness, of connection, and of the intelligence already within us. And then it becomes a way of life.""", None),
]
training = [
    ('Sports science and psychology', None, False),
    ('Occupational therapy', None, False),
    ('Clinical and rehabilitative Pilates', 'more than twenty years', True),
    ('NLP and Ericksonian hypnotherapy', None, False),
    ('Transpersonal coaching psychology', None, False),
    ('Embodiment coaching and Authentic Self-Empowerment', None, False),
    ('Shamanic training', 'North American and South African traditions', False),
]
docs.append({
    '_id': 'aboutPage', '_type': 'aboutPage',
    'heading': L('The clinical came first. Then everything else.'),
    'intro': L('I trained in sports science, psychology and occupational therapy, and taught clinical and rehabilitative Pilates for more than twenty years. Then I went further, into hypnotherapy, embodiment coaching and shamanic practice. Origine is where the two halves meet.'),
    'portrait': photo('beach-shawl.jpg', 'Stephanie laughing on a beach at dusk, wrapped in a pale pink shawl', (0.5, 0.3)),
    'sections': [{'_key': key(), '_type': 'section', 'heading': L(h), 'body': LB(from_text(b)), **({'image': photo(img, 'Stephanie standing at the shore at dusk, hands resting on her chest' if img.startswith('portrait') else 'Candles and tea lights on a wooden table')} if img else {})} for h, b, img in about_sections],
    'training': [{'_key': key(), '_type': 'trainingItem', 'label': L(lbl), **({'detail': L(det)} if det else {}), 'highlight': hl} for lbl, det, hl in training],
})

pages = {
    'work': ('Two ways to work together', 'Most people begin with a single session. Some are ready for the three-month programme. The modalities are the ingredients of both, not a menu to choose from.', None),
    'groups': ('Groups and retreats', 'Moonlight Meditation once a month, free guided meditations every week, and now and then a workshop, a circle or a retreat. Dates appear here first and go out to the list.', None),
    'modalities': ('The modalities', 'These are the techniques a session can draw on. You do not need to choose one before you book. We decide together, based on what you bring.', None),
    'blog': ('The blog', 'Notes on breath, the body and the nervous system, written for people who want to understand what they are doing and why.', None),
    'faq': ('Questions people ask', 'Plain answers about the work, what a session is like, and how booking works. If your question is not here, ask me.', None),
    'contact': ('Get in touch', 'Ask anything. Whether a session is right for you, which modality to start with, or how the programme works.', None),
    'privacy': ('Privacy', 'What this site collects and what happens to it, in plain words.', """## What is collected

When you send a message through the contact form, your name, email address and message are sent to me by email and stored by Netlify, the company that hosts this site, so I can reply to you. When you join the mailing list, your email address and first name are stored by Kit, the newsletter service, and used only to send you news about retreats and Moonlight Meditation dates. You can leave the list with one click in any email.

## What is not collected

This site does not use cookies for advertising and does not track you across other sites. Visitor numbers are counted with Cloudflare Web Analytics, which does not use cookies and does not identify you.

## Booking

Booking a session takes you to Calendly, which has its own privacy policy. Calendly holds the details you enter there so that we both have the appointment.

## Your rights

You can ask me at any time what information I hold about you, ask me to correct it, or ask me to delete it. Write to me using the contact page.""")
}
for pid, (title, intro, body) in pages.items():
    d = {'_id': f'page-{pid}', '_type': 'page', 'title': L(title), 'intro': L(intro)}
    if body: d['body'] = LB(from_text(body))
    docs.append(d)

# Heading order: a page's h1 is the title, so rich text starts at h2. Promote h3 to h2 where a document has no h2.
def promote_headings(blocks):
    if any(b.get('style') == 'h2' for b in blocks):
        return blocks
    for b in blocks:
        if b.get('style') == 'h3':
            b['style'] = 'h2'
    return blocks
for d in docs:
    for field in ('body', 'answer'):
        if isinstance(d.get(field), dict) and isinstance(d[field].get('en'), list):
            promote_headings(d[field]['en'])

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w') as f:
    for d in docs:
        f.write(json.dumps(d, ensure_ascii=False) + '\n')
print(f'wrote {len(docs)} documents to {OUT}')
from collections import Counter
print(Counter(d['_type'] for d in docs))
