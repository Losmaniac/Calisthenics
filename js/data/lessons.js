// Short lessons for the Learn section. `at` = full sessions needed to unlock.
// Each lesson: title, three short paragraphs and one quiz question (q, options, index of the right one, why).
export const LESSONS = [
  { id: 'how', at: 0, fig: 'pushupArcher',
    en: { t: 'How this training works', p: [
      'Calisthenics makes an exercise harder by changing leverage, not by adding plates. Move your hands, lengthen your body or take away a point of support, and the same muscles face a much bigger load. Every ladder in this app is a row of such small steps.',
      'Each session has five parts: a warm-up, one skill practiced while you are fresh, strength pairs, a short finisher and a cool-down. The skill changes from session to session, so every goal gets its turn.',
      'When you reach the top of the target range in every set, two sessions in a row, the app suggests the next rung. You decide whether you are ready.'],
      q: 'How does a bodyweight exercise usually get harder?', a: ['By changing the leverage', 'By adding more reps forever', 'By training every single day'], ok: 0,
      w: 'A longer lever or less support raises the load without any extra weight.' },
    cs: { t: 'Jak tenhle trénink funguje', p: [
      'Kalistenika ztěžuje cvik změnou páky, ne přidáváním kotoučů. Posuň ruce, prodluž tělo nebo uber jeden opěrný bod a stejné svaly dostanou mnohem větší zátěž. Každý žebřík v téhle aplikaci je řada takových malých kroků.',
      'Každý trénink má pět částí: rozcvičení, jeden prvek nacvičovaný v čerstvém stavu, silové dvojice, krátký závěr a zklidnění. Prvek se trénink od tréninku mění, takže se dostane na každý cíl.',
      'Když ve všech sériích dosáhneš horní hranice cílového rozsahu dva tréninky po sobě, aplikace navrhne další příčku. Jestli jsi připravený, rozhoduješ ty.'],
      q: 'Jak se cvik s vlastní vahou obvykle ztěžuje?', a: ['Změnou páky', 'Nekonečným přidáváním opakování', 'Tréninkem každý den'], ok: 0,
      w: 'Delší páka nebo méně opory zvýší zátěž bez jakéhokoli závaží.' } },

  { id: 'warmup', at: 0, fig: 'scapPull',
    en: { t: 'Warm up like you mean it', p: [
      'A warm-up raises your temperature, gets the joints moving and switches on the muscles around the shoulder blades. It is also a rehearsal: the body repeats, lightly, what it is about to do with full effort.',
      'The warm-up here always follows the same order. First something to raise the pulse, then shoulder and scapula drills, then the hips. On handstand and planche days the wrists get extra attention.',
      'Four minutes feels easy to skip. But cold wrists, elbows and shoulders are where most calisthenics injuries begin, and a cold nervous system makes the skill block worse.'],
      q: 'What is the main job of a warm-up?', a: ['To burn as many calories as possible', 'To prepare joints and muscles for the work ahead', 'To stretch as far as you can'], ok: 1,
      w: 'It is preparation and rehearsal, not a workout or a flexibility session.' },
    cs: { t: 'Rozcvič se poctivě', p: [
      'Rozcvičení zvedne teplotu, rozhýbe klouby a zapne svaly kolem lopatek. Je to také zkouška nanečisto: tělo si lehce zopakuje to, co bude za chvíli dělat naplno.',
      'Rozcvička má tady vždy stejné pořadí. Nejdřív něco na zvednutí tepu, pak cviky na ramena a lopatky, potom kyčle. Ve dnech stojky a planche dostanou víc pozornosti zápěstí.',
      'Čtyři minuty se snadno přeskočí. Jenže ve studených zápěstích, loktech a ramenou začíná většina zranění z kalisteniky a studená nervová soustava zhorší nácvik prvku.'],
      q: 'Co je hlavním úkolem rozcvičení?', a: ['Spálit co nejvíc kalorií', 'Připravit klouby a svaly na práci, která přijde', 'Protáhnout se co nejdál'], ok: 1,
      w: 'Je to příprava a zkouška, ne trénink ani protahování.' } },

  { id: 'scapula', at: 1, fig: 'scapPushup',
    en: { t: 'Your shoulder blades run the show', p: [
      'The shoulder blades can move up and down, and they can spread apart or squeeze together. Almost every calisthenics position asks for one of these on purpose.',
      'When you hang, you pull them down: that is the active hang. In a support on bars you also press down. At the top of a push-up and in the planche you spread them apart. At the top of a row you squeeze them together.',
      'The scapula drills in the warm-up train these movements with straight arms. They look small, but they decide whether your shoulders stay healthy under load.'],
      q: 'What do the shoulders do in an active hang?', a: ['Rise toward the ears', 'Pull down, away from the ears', 'Roll forward'], ok: 1,
      w: 'Pulling the shoulders down switches on the back and protects the joint.' },
    cs: { t: 'Lopatky řídí všechno', p: [
      'Lopatky se umí pohybovat nahoru a dolů a také se od sebe rozjíždět nebo se k sobě stahovat. Skoro každá poloha v kalistenice jeden z těchto pohybů vyžaduje záměrně.',
      'Ve visu je stahuješ dolů: to je aktivní vis. Ve vzporu na bradlech také tlačíš dolů. V horní poloze kliku a v planche je rozjíždíš od sebe. V horní poloze přítahu je stahuješ k sobě.',
      'Lopatkové cviky v rozcvičce trénují tyto pohyby s propnutými pažemi. Vypadají drobně, ale rozhodují o tom, jestli ramena zůstanou pod zátěží zdravá.'],
      q: 'Co dělají ramena v aktivním visu?', a: ['Stoupají k uším', 'Stahují se dolů, pryč od uší', 'Přepadávají dopředu'], ok: 1,
      w: 'Stažení ramen dolů zapojí záda a chrání kloub.' } },

  { id: 'hollow', at: 2, fig: 'dish',
    en: { t: 'One shape for almost everything', p: [
      'Ribs down, pelvis tucked under, glutes squeezed, legs together and straight. This is the hollow body, and the dish exercise is simply that shape held on the floor.',
      'You will meet it again in the pull-up, the handstand, the front lever and the planche. A body held this way acts like one solid piece, so the force from your arms reaches your feet.',
      'A loose body leaks force: the hips sag, the legs swing and the exercise feels heavier than it is. When a movement falls apart, check the shape before you blame your strength.'],
      q: 'What defines the hollow body position?', a: ['A big arch in the lower back', 'Ribs down, pelvis tucked, everything tight', 'Relaxed legs and a lifted chin'], ok: 1,
      w: 'It is a slightly rounded, fully tensed line from shoulders to toes.' },
    cs: { t: 'Jeden tvar skoro na všechno', p: [
      'Žebra dole, podsazená pánev, zatnuté hýždě, nohy u sebe a propnuté. To je „hollow body“ a kolébka je prostě tenhle tvar držený na zemi.',
      'Potkáš ho znovu ve shybu, ve stojce, v přední váze i v planche. Takto držené tělo se chová jako jeden pevný kus, takže síla z paží dojde až do chodidel.',
      'Povolené tělo sílu ztrácí: boky se prověsí, nohy se houpou a cvik je těžší, než ve skutečnosti je. Když se pohyb rozpadá, zkontroluj tvar dřív, než začneš vinit sílu.'],
      q: 'Co určuje polohu hollow body?', a: ['Velké prohnutí v bedrech', 'Žebra dole, podsazená pánev, všechno zpevněné', 'Uvolněné nohy a zvednutá brada'], ok: 1,
      w: 'Je to lehce zakulacená, plně zpevněná linie od ramen po špičky.' } },

  { id: 'sets', at: 3, fig: 'pullup',
    en: { t: 'Reps, sets, holds and rest', p: [
      'A target such as 3 × 5–10 means three sets, each between five and ten repetitions. The bottom number is the minimum worth doing. The top number, reached in every set, means it is time to move on.',
      'End a set when your form starts to break, usually one or two reps before you would fail. Clean reps build strength. Ugly ones mostly build bad habits.',
      'The rest timer is part of the training. Strength and skill work need a recovered body, so use the full rest. For holds, the same rule applies: a short, perfect hold beats a long, shaking one.'],
      q: 'When should a strength set end?', a: ['When you cannot move at all', 'When the next rep would be ugly', 'After exactly ten reps, always'], ok: 1,
      w: 'Stopping just before form breaks keeps quality high and joints safe.' },
    cs: { t: 'Opakování, série, výdrže a pauzy', p: [
      'Cíl typu 3 × 5–10 znamená tři série, každá s pěti až deseti opakováními. Spodní číslo je minimum, které má smysl. Horní číslo, dosažené v každé sérii, znamená, že je čas jít dál.',
      'Sérii ukonči, když se začne rozpadat provedení, obvykle jedno až dvě opakování před selháním. Čistá opakování budují sílu. Ošklivá budují hlavně zlozvyky.',
      'Časovač pauzy je součást tréninku. Silová práce i nácvik prvků potřebují odpočaté tělo, takže využij celou pauzu. Pro výdrže platí totéž: krátká dokonalá výdrž je lepší než dlouhá roztřesená.'],
      q: 'Kdy má silová série skončit?', a: ['Když se už vůbec nehneš', 'Když by další opakování bylo ošklivé', 'Vždy přesně po deseti opakováních'], ok: 1,
      w: 'Konec těsně před rozpadem techniky udrží kvalitu vysoko a klouby v bezpečí.' } },

  { id: 'straight', at: 4, fig: 'plancheLean',
    en: { t: 'Straight-arm strength', p: [
      'The planche, the levers and the handstand are held on locked elbows. That is a different kind of strength from push-ups and pull-ups, and it loads the elbows and shoulders in a way they must get used to.',
      'A lever or planche with bent arms is an easier, different exercise. If you can only hold a position by bending your elbows, the honest answer is one step back with your arms locked.',
      'Build this strength slowly. Short holds, done often, with perfect elbows, will take you further than heroic attempts.'],
      q: 'You can hold a tuck planche only with bent arms. What now?', a: ['Keep going, it will straighten out', 'Go back a step and hold it with locked arms', 'Move on to the next progression'], ok: 1,
      w: 'Locked elbows are the skill. Bent arms train something else.' },
    cs: { t: 'Síla na propnutých pažích', p: [
      'Planche, váhy i stojka se drží na zamčených loktech. Je to jiný druh síly než u kliků a shybů a zatěžuje lokty a ramena způsobem, na který si musejí zvyknout.',
      'Váha nebo planche s pokrčenými pažemi je jiný, snazší cvik. Pokud polohu udržíš jen s pokrčenými lokty, poctivá odpověď je krok zpět se zamčenými pažemi.',
      'Tuhle sílu buduj pomalu. Krátké výdrže, prováděné často a s dokonalými lokty, tě dostanou dál než hrdinské pokusy.'],
      q: 'Planche ve skrčce udržíš jen s pokrčenými pažemi. Co teď?', a: ['Pokračovat, samo se to narovná', 'Vrátit se o krok a držet se zamčenými pažemi', 'Přejít na další stupeň'], ok: 1,
      w: 'Zamčené lokty jsou podstata prvku. Pokrčené paže trénují něco jiného.' } },

  { id: 'grip', at: 5, fig: 'falseHang',
    en: { t: 'Grip and the false grip', p: [
      'Everything you do on a bar passes through your hands. For many people the grip gives out before the back does, which is why hangs, towel pull-ups and fingertip push-ups are worth their time.',
      'Wrap your thumb around the bar for anything dynamic. It costs nothing and it keeps you on the bar when a hand slips.',
      'The false grip puts the wrist on top of the bar before you start pulling. Because the hand is already there, you can move slowly from the pull into the dip of a muscle-up. It is hard on the forearms at first, so build it up over weeks.'],
      q: 'What is the point of the false grip?', a: ['It makes the pull-up shorter', 'The wrist is already above the bar, so no re-grip is needed', 'It rests the forearms'], ok: 1,
      w: 'With the wrist on top, the transition of the muscle-up can be done slowly.' },
    cs: { t: 'Úchop a false grip', p: [
      'Všechno, co děláš na hrazdě, jde přes ruce. Spoustě lidí povolí úchop dřív než záda, a proto se visy, shyby na ručníku a kliky na prstech vyplatí.',
      'U všeho dynamického obejmi hrazdu palcem. Nic to nestojí a udrží tě to na hrazdě, když ruka sklouzne.',
      'False grip položí zápěstí na hrazdu ještě před začátkem tahu. Ruka už je nahoře, takže můžeš z tahu přejít do dipu muscle-upu pomalu. Zpočátku dává zabrat předloktím, proto ho buduj týdny.'],
      q: 'K čemu je false grip?', a: ['Zkracuje shyb', 'Zápěstí je už nad hrazdou, takže není třeba přehmatávat', 'Odpočinou si při něm předloktí'], ok: 1,
      w: 'Se zápěstím nahoře jde přechod muscle-upu udělat pomalu.' } },

  { id: 'fresh', at: 6, fig: 'handstand',
    en: { t: 'Practice skills while you are fresh', p: [
      'Balance and coordination are learned by the nervous system, and it learns whatever you repeat. Tired repetitions teach a sloppy version of the skill.',
      'That is why the skill block comes right after the warm-up, in short sets with generous rest. It should feel almost too easy on the lungs.',
      'Many crisp attempts beat a few long struggles. Five clean ten-second handstands teach more than one desperate thirty-second fight. Stop when the quality drops.'],
      q: 'Why does the skill block come first?', a: ['Skills are learned best with a fresh nervous system', 'To get it out of the way', 'Because it burns the most energy'], ok: 0,
      w: 'Fatigue teaches the body a worse version of the movement.' },
    cs: { t: 'Prvky nacvičuj v čerstvém stavu', p: [
      'Rovnováhu a koordinaci se učí nervová soustava a naučí se to, co opakuješ. Unavená opakování učí odbytou verzi prvku.',
      'Proto nácvik prvku přichází hned po rozcvičení, v krátkých sériích s velkorysou pauzou. Na dech by měl působit skoro až moc lehce.',
      'Hodně čistých pokusů je víc než pár dlouhých bojů. Pět čistých desetivteřinových stojek naučí víc než jeden zoufalý třicetivteřinový zápas. Skonči, když kvalita klesne.'],
      q: 'Proč je nácvik prvku na začátku?', a: ['Prvky se nejlépe učí s čerstvou nervovou soustavou', 'Aby to bylo z krku', 'Protože spálí nejvíc energie'], ok: 0,
      w: 'Únava učí tělo horší verzi pohybu.' } },

  { id: 'range', at: 8, fig: 'pushup',
    en: { t: 'Full range, no momentum', p: [
      'A full pull-up goes from a dead hang to the chin over the bar. A full push-up goes from chest on the floor to locked arms. Partial reps build partial strength, and usually in the easiest part of the movement.',
      'Swinging and kicking move the load away from the muscles you want to train. Momentum has its place, for example when you learn the muscle-up, but strict strength comes first.',
      'Only strict, full-range reps count toward a level-up. If you squeeze out a few rough ones at the end of a set, enjoy them, and log the clean number.'],
      q: 'Which rep counts toward a level-up?', a: ['Any rep that gets the chin up', 'A fast rep with a small kick', 'A full-range rep with no swing'], ok: 2,
      w: 'Strict reps are the ones that tell you the truth about your strength.' },
    cs: { t: 'Plný rozsah, žádný švih', p: [
      'Plný shyb jde z visu až bradou nad hrazdu. Plný klik jde od hrudníku na zemi po zamčené paže. Poloviční opakování budují poloviční sílu, a to obvykle v nejsnazší části pohybu.',
      'Houpání a kopání přesouvají zátěž mimo svaly, které chceš trénovat. Švih má své místo, třeba při učení muscle-upu, ale striktní síla má přednost.',
      'Do postupu se počítají jen striktní opakování v plném rozsahu. Když na konci série vymáčkneš pár hrubších, užij si je, ale zapiš čisté číslo.'],
      q: 'Které opakování se počítá do postupu?', a: ['Každé, při kterém se brada dostane nahoru', 'Rychlé opakování s malým kopnutím', 'Opakování v plném rozsahu bez švihu'], ok: 2,
      w: 'Striktní opakování ti řeknou pravdu o tvé síle.' } },

  { id: 'recovery', at: 10, fig: 'deepSquat',
    en: { t: 'Rest, sleep and easy weeks', p: [
      'Training is the signal. The strength itself is built between sessions, and sleep is the most powerful recovery tool you have. Seven to nine hours does more than any supplement.',
      'Signs of doing too much: your numbers fall for a week or longer, joints ache constantly, sleep gets worse and motivation disappears. The fix is an easy week: the same exercises with half the sets.',
      'Signs of doing too little: every session feels comfortable and you never reach the top of your ranges. Then the answer is focus and effort, not more exercises.'],
      q: 'Your numbers have dropped for a week and your elbows ache. What now?', a: ['Add an extra session', 'Take an easy week: half the sets, same exercises', 'Switch to a completely new program'], ok: 1,
      w: 'A planned easy week lets joints and nervous system catch up.' },
    cs: { t: 'Odpočinek, spánek a lehké týdny', p: [
      'Trénink je signál. Samotná síla se buduje mezi tréninky a spánek je nejsilnější regenerační nástroj, který máš. Sedm až devět hodin udělá víc než jakýkoli doplněk.',
      'Známky přetížení: výkony klesají týden nebo déle, klouby pořád bolí, spánek se zhoršuje a motivace mizí. Řešením je lehký týden: stejné cviky s polovinou sérií.',
      'Známky nedostatečné zátěže: každý trénink je pohodlný a nikdy nedosáhneš horní hranice rozsahů. Pak je odpovědí soustředění a úsilí, ne další cviky.'],
      q: 'Výkony ti týden klesají a bolí tě lokty. Co teď?', a: ['Přidat trénink navíc', 'Lehký týden: polovina sérií, stejné cviky', 'Přejít na úplně nový program'], ok: 1,
      w: 'Plánovaný lehký týden dá kloubům i nervové soustavě čas dohnat zbytek.' } },

  { id: 'pain', at: 12, fig: 'crossBody',
    en: { t: 'Pain is not soreness', p: [
      'Muscle soreness is dull, sits in the muscle, usually on both sides, and fades within two or three days. You can train lightly through it.',
      'Sharp, pinching or one-sided pain in a joint is different. So is any pain that changes the way you move. Stop that exercise for the day and choose a variation that does not hurt.',
      'Do not test an injury daily to see whether it is still there. Train what feels fine and give the sore area time. If pain lasts more than a week or two, or comes with swelling, numbness or weakness, see a physiotherapist or a doctor.'],
      q: 'A sharp pinch in the shoulder during dips. Best response?', a: ['Push through, it will warm up', 'Stop that exercise and use a pain-free alternative', 'Do more reps with less depth'], ok: 1,
      w: 'Sharp joint pain is information. Working around it keeps a small problem small.' },
    cs: { t: 'Bolest není svalovka', p: [
      'Svalovka je tupá, sedí ve svalu, obvykle na obou stranách, a během dvou tří dnů odezní. Lehce trénovat se s ní dá.',
      'Ostrá, štípavá nebo jednostranná bolest v kloubu je něco jiného. Stejně tak jakákoli bolest, která mění způsob pohybu. Ten cvik pro dnešek ukonči a zvol variantu, která nebolí.',
      'Nezkoušej zranění denně, jestli tam ještě je. Trénuj to, co je v pořádku, a bolavému místu dej čas. Pokud bolest trvá déle než týden či dva nebo ji provází otok, brnění či slabost, zajdi za fyzioterapeutem nebo lékařem.'],
      q: 'Při dipech tě ostře píchne v rameni. Nejlepší reakce?', a: ['Protlačit to, zahřeje se to', 'Ukončit ten cvik a použít variantu bez bolesti', 'Udělat víc opakování s menší hloubkou'], ok: 1,
      w: 'Ostrá bolest v kloubu je informace. Když ji obejdeš, malý problém zůstane malý.' } },

  { id: 'hands', at: 14, fig: 'pullupTowel',
    en: { t: 'Take care of your hands', p: [
      'Calluses are useful armor. Thick, dry ridges are not: they catch on the bar and tear. Once a week, after a shower, file them down until they are flat, and use a moisturizer.',
      'Chalk keeps the grip dry, so you squeeze less and the skin slides less. Wash it off after training, because chalk dries the skin out.',
      'If a callus does tear, clean it, cover it and leave hanging work alone for a few days. Legs, core and handstands still work. Skin heals fast when it is not ripped open again.'],
      q: 'How do you stop calluses from tearing?', a: ['Let them grow as thick as possible', 'File them flat and keep the skin supple', 'Wear thick gloves for every session'], ok: 1,
      w: 'A flat, supple callus protects. A raised, dry one rips.' },
    cs: { t: 'Starej se o ruce', p: [
      'Mozoly jsou užitečné brnění. Tlusté, suché hrany ne: zachytí se o hrazdu a utrhnou se. Jednou týdně, po sprše, je obruš do roviny a ruce namaž krémem.',
      'Magnézium udržuje úchop suchý, takže svíráš méně a kůže se méně posouvá. Po tréninku ho umyj, protože kůži vysušuje.',
      'Když se mozol přece jen utrhne, vyčisti ho, zakryj a pár dní vynech visy. Nohy, střed těla a stojky jdou trénovat dál. Kůže se hojí rychle, když ji znovu neroztrhneš.'],
      q: 'Jak zabránit trhání mozolů?', a: ['Nechat je narůst co nejtlustší', 'Obrousit je do roviny a udržovat kůži vláčnou', 'Na každý trénink nosit tlusté rukavice'], ok: 1,
      w: 'Plochý, vláčný mozol chrání. Vystouplý a suchý se trhá.' } },

  { id: 'tendons', at: 16, fig: 'frontlever',
    en: { t: 'Tendons take their time', p: [
      'Muscles adapt within weeks. Tendons and ligaments need months. That gap is why a skill can feel possible for your muscles while your elbows, wrists or shoulders are not ready for it.',
      'Add difficulty in small steps and keep the amount of straight-arm work modest. Never go for a maximum attempt when a joint already feels irritated.',
      'Consistency wins here. Three calm sessions a week for a year change your connective tissue. Three wild weeks followed by two months off do not.'],
      q: 'Why progress slowly on levers and planche even when the muscles feel ready?', a: ['Tendons and ligaments strengthen more slowly than muscles', 'Because slow progress looks more professional', 'Muscles forget fast skills'], ok: 0,
      w: 'Connective tissue is the slowest part of the system, so it sets the pace.' },
    cs: { t: 'Šlachy si dávají na čas', p: [
      'Svaly se přizpůsobí během týdnů. Šlachy a vazy potřebují měsíce. Kvůli tomuto rozdílu může být prvek pro svaly zvládnutelný, i když na něj lokty, zápěstí nebo ramena ještě nejsou připravené.',
      'Obtížnost přidávej po malých krocích a práce na propnutých pažích dělej s mírou. Nikdy nechoď do maximálního pokusu, když je kloub už podrážděný.',
      'Tady vítězí pravidelnost. Tři klidné tréninky týdně po dobu jednoho roku změní tvoje pojivové tkáně. Tři divoké týdny a potom dva měsíce pauzy ne.'],
      q: 'Proč u vah a planche postupovat pomalu, i když jsou svaly připravené?', a: ['Šlachy a vazy sílí pomaleji než svaly', 'Protože pomalý postup vypadá profesionálněji', 'Svaly rychle zapomínají rychlé prvky'], ok: 0,
      w: 'Pojivová tkáň je nejpomalejší část systému, takže určuje tempo.' } },

  { id: 'food', at: 18, fig: 'squat',
    en: { t: 'Eating for strength', p: [
      'Strength training needs building material. A widely used target is roughly 1,6 grams of protein per kilogram of bodyweight a day, spread over your meals.',
      'You also need enough total energy. Being lighter helps with levers and handstands, but crash diets take strength away faster than they take weight off. If you want to lose fat, do it slowly.',
      'Beyond that, the basics carry most of the result: mostly unprocessed food, plenty of vegetables and fruit, and enough water, especially around training.'],
      q: 'Which habit helps strength gains most?', a: ['Skipping meals on training days', 'Protein with every meal and enough total food', 'Avoiding all carbohydrates'], ok: 1,
      w: 'Muscle is built from protein, and the building needs energy.' },
    cs: { t: 'Jídlo pro sílu', p: [
      'Silový trénink potřebuje stavební materiál. Často používaný cíl je zhruba 1,6 gramu bílkovin na kilogram tělesné hmotnosti denně, rozložený do jídel během dne.',
      'Potřebuješ také dost celkové energie. Nižší váha pomáhá u vah a stojek, ale drastické diety berou sílu rychleji než kila. Pokud chceš shodit tuk, dělej to pomalu.',
      'Jinak většinu výsledku udělají základy: převážně nezpracované potraviny, hodně zeleniny a ovoce a dostatek vody, hlavně kolem tréninku.'],
      q: 'Který návyk pomáhá růstu síly nejvíc?', a: ['Vynechávat jídla v tréninkové dny', 'Bílkoviny v každém jídle a dost jídla celkově', 'Vyhýbat se všem sacharidům'], ok: 1,
      w: 'Svaly se staví z bílkovin a stavba potřebuje energii.' } },

  { id: 'stretch', at: 20, fig: 'pikeFold',
    en: { t: 'Stretching that sticks', p: [
      'Before training, move: the warm-up drills take the joints through their range without long holds. Long static stretches fit better after training or on rest days.',
      'Hold a stretch for thirty to sixty seconds, breathe slowly and stay at mild discomfort, never pain. A few minutes on most days beats one long session a week.',
      'Flexibility unlocks skills. Open shoulders make the handstand straight, long hamstrings make the half lever possible, and mobile hips and ankles make the single-leg squat reachable.'],
      q: 'When do long static stretches fit best?', a: ['Right before a maximum attempt', 'After training or on rest days', 'Only in the morning'], ok: 1,
      w: 'Before training you want movement. Long holds work best when the session is done.' },
    cs: { t: 'Protahování, které vydrží', p: [
      'Před tréninkem se hýbej: cviky z rozcvičky provedou klouby jejich rozsahem bez dlouhých výdrží. Dlouhé statické protahování se hodí spíš po tréninku nebo ve dnech volna.',
      'V protažení vydrž třicet až šedesát vteřin, dýchej pomalu a zůstaň na hranici mírného nepohodlí, nikdy bolesti. Pár minut většinu dní je víc než jedno dlouhé protahování týdně.',
      'Pohyblivost odemyká prvky. Otevřená ramena narovnají stojku, dlouhé hamstringy umožní přednos a pohyblivé kyčle s kotníky zpřístupní dřep na jedné noze.'],
      q: 'Kdy se dlouhé statické protahování hodí nejvíc?', a: ['Těsně před maximálním pokusem', 'Po tréninku nebo ve dnech volna', 'Jen ráno'], ok: 1,
      w: 'Před tréninkem chceš pohyb. Dlouhé výdrže fungují nejlíp po něm.' } },

  { id: 'plateau', at: 24, fig: 'pullupNeg',
    en: { t: 'When progress stalls', p: [
      'Plateaus are a normal part of training. Before you change the plan, check the simple things: sleep, food and whether you really trained three times a week.',
      'Then change one thing at a time. Add a set. Slow down the lowering phase. Use an in-between step such as negatives or holds at the point where you get stuck. Or take one extra rest day.',
      'Skills often improve in jumps. Weeks of nothing, then one day the handstand simply stays up. The quiet weeks are when that jump is being prepared, so keep showing up.'],
      q: 'What do you check first when you stall?', a: ['A new, harder program', 'Sleep, food and consistency', 'More exercises per session'], ok: 1,
      w: 'Most plateaus come from recovery and consistency, not from the plan.' },
    cs: { t: 'Když se pokrok zastaví', p: [
      'Stagnace je normální součást tréninku. Než změníš plán, zkontroluj jednoduché věci: spánek, jídlo a jestli opravdu trénuješ třikrát týdně.',
      'Potom měň vždy jen jednu věc. Přidej sérii. Zpomal spouštěcí fázi. Použij mezikrok, třeba negativní opakování nebo výdrže v bodě, kde se zasekáváš. Nebo si dej jeden den volna navíc.',
      'Prvky se často zlepšují skokově. Týdny nic, a pak jednoho dne stojka prostě zůstane stát. V těch tichých týdnech se ten skok připravuje, takže nepřestávej chodit.'],
      q: 'Co zkontroluješ jako první, když stagnuješ?', a: ['Nový, těžší program', 'Spánek, jídlo a pravidelnost', 'Víc cviků v každém tréninku'], ok: 1,
      w: 'Většina stagnací pramení z regenerace a pravidelnosti, ne z plánu.' } },
];
