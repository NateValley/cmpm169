class Gallery extends Phaser.Scene {
    constructor() {
        super("GalleryScene");
        this.my = {sprite: {}};
    }
    preload(){
        this.load.image('BOX', 'Scenes/nom.png');
        this.load.spritesheet('camp', 'Scenes/spritesheet.png',{
            frameWidth: 1920,
            frameHeight: 1080,
        });
    }
    create(){
        let my = this.my;
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        my.sprite = this.add.sprite(960, 560, 'camp');
        my.Box = this.add.sprite(960, 150, 'BOX');
        var animationConfig = {
            key: "spin",
          
            frames: this.anims.generateFrameNumbers("camp", {start: 0, end: 20}),
            repeat: 0,
            frameRate: 20,
        };
        this.anims.create(animationConfig);
        //my.sprite.play("spin",true);
        
        this.ruleGrammar = tracery.createGrammar({
                
            "move":["flock", "race", "glide", "dance", "flee", "lie"],
            "bird":["swan", "heron", "sparrow", "swallow", "wren", "robin"],
            "animal":["#bird#", "Turtle", "Banana Slug", "SilverFish","Panda"],
            "agent":["cloud", "wave", "#bird#", "boat", "ship"],
            "transVerb":["forget", "plant", "greet", "remember", "embrace", "feel", "love"],
            "emotion":["sorrow", "gladness", "joy", "heartache", "love", "forgiveness", "grace"],
            "substance":["#emotion#", "mist", "fog", "glass", "silver", "rain", "dew", "cloud", "virtue", "sun", "shadow", "gold", "light", "darkness"],
            "adj":["fair", "bright", "splendid", "divine", "inseparable", "fine", "lazy", "grand", "slow", "quick", "graceful", "grave", "clear", "faint", "dreary"],
            "doThing":["come", "move", "cry", "weep", "laugh", "dream"],
            "verb":["fleck", "grace", "bless", "dapple", "touch", "caress", "smooth", "crown", "veil"],
            "verbed":["flecked", "graced", "blessed", "dappled", "touched", "caressed", "smoothed", "crowned", "veiled", "shaded", "unleashed"],
            "ground":["glen", "river", "vale", "sea", "meadow", "forest", "glade", "grass", "sky", "waves"],
            "poeticAdj":["#substance#-#verb.ed#"],
            "poeticDesc":["#poeticAdj#", "by #substance# #verb#'d", "#adj# with #substance#", "#verbed# with #substance#"],
            "ah":["ah", "alas", "oh", "yet", "but", "and", "unless"],
            "on":["on", "in", "above", "beneath", "under", "by", "within"],
            "punctutation":[",", ":", " ", "!", ".", "?"],
            "starters":["Once upon a time","Twas the #substance#", "Twas the #adj#", "Somewhere #on# the #ground#"],
            "noun":["#ground#", "#agent#"],
            "FIRST":["#starters# #move#ing #verb#fully #on# the #ground#, a #animal# felt #emotion#\nfor the first time in there life#punctutation# "],
            "seg1":["#ah# the #agent#s couldn't forgive its impatientness."],
            "seg2":["If the words of the #agent# were true, then the #agent# would be\n#poeticDesc#."],
            "seg3":["All would #doThing# at a simple realization that #substance# would be #on# reach" ],
            "line":["#seg1#", "#seg2#", "#seg3#"],
        });
        this.poem = this.ruleGrammar.flatten("#FIRST#");
        console.log(this.poem);
        my.sprite.t = this.add.text(350, 100, this.poem,{ font: '32px Arial', fill: '#000000' });
        

        this.ashGrammar = tracery.createGrammar({
            
            "person": ["pirate", "blacksmith", "soldier", "child", "doctor", "person", "robot", "animatronic", "sailor", "student", "mermaid", "ghost", "king", "grandmother"],
            "fish": ["gar", "pike", "eel", "salmon", "trout", "bass", "catfish", "halibut", "mackerel", "sturgeon"],
            "animal": ["#fish#", "squirrel", "monkey", "hamster", "dog", "cat", "shrimp", "bird"],
            "environment": ["cloud", "storm", "forest", "stream", "mountain", "hill", "ocean"],
            "food": ["banana", "apple", "mango", "lasagna", "croissant", "raw egg", "broccoli", "cake", "donut", "steak", "eggroll", "soup", "pasta", "porridge", "oatmeal", "moldy bread", "pet food"],
            "noun": ["#person#", "#animal#", "#environment#", "#food#"],
            "color": ["blue", "purple", "green", "rose", "periwinkle", "red", "orange", "yellow", "piss yellow", "poop brown", "vomit green", "white", "black", "gray"],
            "adjColor": ["#adj# #color#", "glowing #color#", "translucent #color#"],
            "verb": ["stand", "weep", "quake", "think", "ponder", "reminisce", "plead", "accept", "stare"],
            "transVerb":["throw", "pour", "spill", "eat", "roll", "scold", "throws up"],
            "move": ["run", "walk", "jog", "skip", "soar", "slide", "glide"],
            "adj": ["awe-inspiring", "pitiful", "disappointing", "beautiful", "melancholic", "ethereal", "deep", "piercing", "rumbling", "sharp", "gross"],
            "adverb": ["wearily", "joyfully", "gleefully", "earnestly", "gloomily"],
            "conjunction": ["but", "though", "nevertheless", "and", "yet"],
            "relativeLocation": ["next to", "besides", "residing inside", "above", "far above", "far below", "near"],
            "determiner": ["a few", "some", "a couple", "several"],
            "emotion": ["melancholic", "desperate", "lonely", "fearful", "anxious", "hopeful", "relieved", "cautious", "ecstatic", "joyous", "curious", "wary", "depressed", "empty", "confused", "enraged", "scornful"],
            "transition": ["then", "suddenly", "meanwhile", "soon", "later", "at that very moment", "soon after", "not before long", "a few moments later"],
            "punctuation":[",", ":", "!!", ".", "?", "!?", "-", "..."],

            "line1": ["[MC:#person#]The #environment# is tinted in #adjColor##punctuation#\nA #emotion# #MC# #transVerb#s their #food##punctuation# #transition# a #adj# #animal# #verb#s,\nbefore approaching the #MC# #adverb#."],
            "line2": ["[MF:#fish#]A #MF# #move#s through the #environment##punctuation#\nThe #MF# #adverb# #verb#s before it eats a #food#."],
            "line3": ["A #person# #verb#s before the #adj# #noun#. Never before have they felt this.\nWhat are they feeling#punctuation# #emotion#? Perhaps #emotion#? Or maybe even #emotion#?\n#transition#, they #verb#."],
            "line4": ["[MF:#food#]#relativeLocation# the #adjColor# #animal#, a #adj# #MF# #verb#s, waiting.\nWaiting for the #person# destined to meet it. #conjunction#,\nthe #MF# is #emotion# they have yet to meet."],

            "lineChoices": ["#line1#", "#line2#", "#line3#", "#line4#"], // use this!!
            "multiLine":["#line1#\n\n#line2#\n\n#line3#\n\n#line4#"],
            "origin":["#multiLines#"]
        });

        // this.aStory = this.ashGrammar.flatten("#multiLine#");
        // console.log(this.aStory);
        // my.sprite.t2 = this.add.text(350, 100, this.aStory,{ font: '32px Arial', fill: '#000000' , wordWrap: {width: 1000}});
        this.nateGrammar = tracery.createGrammar({
            "environment":["Island", "Waters", "Caves", "Skies", "Swamps", "Ocean", "Bedroom", "Minds of", "Kingdom", "City"],
            "adj":["Damaged", "Glazed", "Boiled", "Forgotten", "Digital", "Comically Large", "Sentient"],
            "objects":["Birds", "E-Cigarettes", "Laundry", "Credit Cards", "Fugitives", "Fish Eggs", "Costcos", "Cashews", "Big Booms", "Hawk Tuahs"],
            "setting":["#environment# of #adj# #objects#"],

            "event":["War", "Revolution", "Renaissance", "Evolution", "Destruction", "Tragedy"],
            "concept":["Brain Rot", "Big Stinky Dookie Doo-Doos", "E-Dating", "Depression", "Tax Evasion", "Divorce", "Dreams", "the Letter 'O'", "Alternative Medicines", "True Crime Podcasts"],
            "reacted":["rejoiced", "locked the fuck in", "finally found careers despite what their shitty friends and family believed", "lost all of their social credit", "forgot how to read anything, like forever"],


            "segment1":["The people of the #setting# #reacted#!\nThe #event# of #concept# has finally ended."],
            "segment2":["The representative from the #setting# explained,\n\"We found that the test subjects #reacted# in response to our... \\\"#objects#\\\"\"."],
            "segment3":["\"You're too late...\nthe #event# of #concept# has now begun!\""],

            "segments":["#segment1#", "#segment2#", "#segment3#"],
        });
        
    }
    update(){
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            const randomNumber = Math.floor(Math.random() * 3);
            if(randomNumber == 0){
                this.poem = this.ruleGrammar.flatten("#line#");
            }
            else if(randomNumber == 1){
                this.poem = this.ashGrammar.flatten("#lineChoices#");
            }
            else{
                this.poem = this.nateGrammar.flatten("#segments#");
            }
            this.my.Box.setVisible(false);
            this.my.sprite.t.setVisible(false);
            this.my.sprite.play("spin",true);
            this.my.sprite.on('animationcomplete', () => {
                this.my.sprite.t.setVisible(true);
                this.my.Box.setVisible(true);
                this.my.sprite.t.setText(this.poem);
            });
            
        }
    }
    
}