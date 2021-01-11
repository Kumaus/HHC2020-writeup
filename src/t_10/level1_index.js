const canvas = document.getElementById('gamecanvas');
const canvas_square_size = 624;
canvas.width = canvas_square_size + 1;
canvas.height = canvas_square_size + 1;
const ctx = canvas.getContext('2d');

ctx.fillStyle = "rgba(0,0,0, 0.0)";

// https://www.youtube.com/watch?v=eI9idPTT0c4

const bw = 48;
// Box height
const bh = 48;
// Padding
const p = 0;

const num_of_rows_columns = canvas_square_size / bw


/*const textareacode = document.getElementById('code');
const editor = CodeMirror.fromTextArea(textareacode, {
    lineNumbers: true,
    mode:  "javascript"
});*/

// __POST_RESULTS__({hash: 'ffb4288a8f4272b0704d5220e8402967a06913a01f27ed6196df72a6267a3ac6',resourceId: resourceId})
// const urlVars=__PARSE_URL_VARS__(),resourceId=urlVars.resourceId;resourceId||console.error(atob('Tm8gcmVzb3VyY2UgSUQgcHJvdmlkZWQh'));

// 1 is walkable, 0 is not, 2 is lollipop, 3 is start, 4 is end,
// -1 through -5 are different block images (not walkable)
/* 5 is springs, 6 is lever that performs action.
// 20+ is munchkins but you put those in on the munchkins themselves and not in the grid
this.game_grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
    [0, 0, 4, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
]

elf.moveLeft(4)
elf.pull_lever(elf.get_lever(0) + 2) // Question asks us to add 2
elf.moveLeft(2)
elf.moveUp(8)
elf.moveLeft(4)
elf.moveUp(2)

var value = elf.ask_munch(1) // munchkin gives us an array [1,2,"a"]
var answer = value.filter(elem => typeof elem === 'string') // Only wants strings
elf.moveLeft(1) // need to be within one square of munchkin
elf.tell_munch(answer) // we submit our array answer of only strings
elf.moveLeft(5)


elf.moveTo(lollipop[0])
elf.moveTo(munchkin[0])

*/

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(min, max) {
    return [...Array(getRandomInt(min, max))].map(i=>(~~(Math.random()*36)).toString(36)).join('')
}

class Game {
    constructor() {
        this.game_grid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
            [0, 0, 4, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        ]
        // Max number of lines players have to solve and max number times they can call elf functions:
        this.maxLines = 2
        this.maxElfFuncCalls = 2
        this.elfFuncCallUsed = 0
        console_callback('info', 'Program the elf to the end goal in no more than '+this.maxLines+' lines of code and no more than '+this.maxElfFuncCalls+' elf commands.')
        // Codemirror lacks this so I need to hide one more than my max number of lines
        $('<style type="text/css"> .CodeMirror-code div:nth-of-type('+(this.maxLines+1)+') {display: none;} </style>').appendTo("head");
        // Clear these on game start;
        $('#ingame_objects_body').html('');
        $('#lollipops_collected').html('');
        // set canvas background instead of writing the background to canvas each frame
        canvas.style.background = "url('/imgs/mini_game_bg.png')";
        var xy = this.get_grid_coords(3)[0];
        this.end_coords = this.get_grid_coords(4)[0];
        this.lollipop_coords = this.get_grid_coords(2);
        this.found_lollipop_coords = []
        this.block_coords = this.get_grid_coords(-99, 0);
        this.x = xy.x * bw;
        this.y = xy.y * bh;
        this.cur_xy = {'x':xy.x,'y':xy.y}
        this.dest_gridx = xy.x;
        this.dest_gridy = xy.y;
        this.dest_x = xy.x * bw;
        this.dest_y = xy.y * bh;
        this.rotation = 0
        this.alpha = 1;
        this.game_started = false
        //this.radius = bh / 2 - 2;
        //this.color = color;
        this.speed = 1;
        this.moving = false;
        this.actions = []
        this.frames = 10.0;  // the average frames from my power rig that looked good from when I was in dev.
        this.delta = 1;
        this.last_time = 0;
        // this will store lever answers
        this.__protos__ = {};
        // this will store munchkin answers
        this.__prot__ = {};
        var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (var i = 0; i < methods.length; i++) {
            this[methods[i]].toString = function(){return ''};
        }
        this.dir = 's'
        this.dead = false;
        this.spring_dir;
        this.spring_dead = false;
        this.anims = {
            'n':['/imgs/elf/n.png','/imgs/elf/nl.png','/imgs/elf/n.png','/imgs/elf/nr.png'],
            'ni':0,
            's':['/imgs/elf/s.png','/imgs/elf/sl.png','/imgs/elf/s.png','/imgs/elf/sr.png'],
            'si':0,
            'e':['/imgs/elf/e.png','/imgs/elf/el.png','/imgs/elf/e.png','/imgs/elf/er.png'],
            'ei':0,
            'w':['/imgs/elf/w.png','/imgs/elf/wl.png','/imgs/elf/w.png','/imgs/elf/wr.png'],
            'wi':0,
            'd':new Image()
        }
        this.anims.d.src = '/imgs/elf/d.png'
        this.pit = {
            vup:new Image(),
            vdown:new Image(),
            hup:new Image(),
            hdown:new Image(),
            arr:[]
        }
        this.pit.vup.src = '/imgs/pit/pit_vup.png';
        this.pit.vdown.src = '/imgs/pit/pit_vdown.png';

        this.pit.hup.src = '/imgs/pit/pit_up.png';
        this.pit.hdown.src = '/imgs/pit/pit_down.png';
        
        this.pit_coords = this.get_grid_coords(10, 14);
        for (let i = 0; i < this.pit_coords.length; i++) {
            let up = false;
            let uimg = this.pit.hup
            let dimg = this.pit.hdown
            if ([10,12].includes(this.pit_coords[i].num)) {
                up = true
            }
            if ([12,13].includes(this.pit_coords[i].num)) {
                uimg = this.pit.vup
                dimg = this.pit.vdown
            }
            this.pit.arr.push({
                'up':up,
                'u': uimg,
                'd': dimg,
                'x': this.pit_coords[i].x * bw,
                'y': (this.pit_coords[i].y * bh),
                'gx':this.pit_coords[i].x,
                'gy':this.pit_coords[i].y
            });
        }

        this.munchkin = {
            anims: {
                'n':['/imgs/munch/n.png','/imgs/munch/nl.png','/imgs/munch/n.png','/imgs/munch/nr.png'],
                's':['/imgs/munch/s.png','/imgs/munch/sl.png','/imgs/munch/s.png','/imgs/munch/sr.png'],
                'e':['/imgs/munch/e.png','/imgs/munch/el.png','/imgs/munch/e.png','/imgs/munch/er.png'],
                'w':['/imgs/munch/w.png','/imgs/munch/wl.png','/imgs/munch/w.png','/imgs/munch/wr.png'],
                'd':new Image()
            },
            animspeed:200,
            munchkins: [

            ]
        }
        this.munchkin.anims.d.src = '/imgs/munch/d.png'
        for (var i = 0; i < this.lollipop_coords.length; i++) { 
            // need to clone interactible in-game objects from here.
            var html = btoa("<div class='modal-content'><div class='modal-header'><span class='close closemodal'>&times;</span><h2 id='modal_header' style='text-align: center;'>LOLLIPOP #"+i+":</h2></div><div class='modal-body'>"+marked('**Info:**<br><br>Your elf must pick this lollipop up before reaching the end goal.<br><br>Your elf can also move towards this object using:<br><br>`elf.moveTo(lollipop['+i+'])`')+"</div></div>");
            var cont = '<div class="pixel interact_cont lollipop_int" onclick="open_modal('+i+', false, `'+html+'`)"><span>'+i+'</span></div>';
            $('#ingame_objects_body').append(cont); 
        }

        for (var i = 0; i < this.munchkin.munchkins.length; i++) {
            this.munchkin.munchkins[i].code.data.toString = function() {return ''};
            this.munchkin.munchkins[i].code.answer.toString = function() {return ''};
            // need to clone interactible in-game objects from here.
            var html = btoa("<div class='modal-content'><div class='modal-header'><span class='close closemodal'>&times;</span><h2 id='modal_header' style='text-align: center;'>MUNCHKIN #"+i+" OBJECTIVE:</h2></div><div class='modal-body'>"+marked('**Objective:**<br>')+this.munchkin.munchkins[i].code.question+marked("**Note**<br><br>If you submit a correct answer to `elf.tell_munch(answer)`, then the munchkin will become friendly. <br><br>In order to run `elf.tell_munch(answer)` with elf *(#"+i+")*, you **must** be standing within 1 grid square of the munchkin.<br><br>You **must** specify the elf number when using `elf.ask_munch(0)`")+"<br></div></div>");
            var cont = '<div class="pixel interact_cont munchkin" onclick="open_modal('+i+', false, `'+html+'`)"><span>'+i+'</span></div>';
            $('#ingame_objects_body').append(cont); 
        }
        
        this.win = new Image();
        this.win.src = '/imgs/win.png'
        this.lose = new Image();
        this.lose.src = '/imgs/lose.png'
        this.fail = new Image();
        this.fail.src = '/imgs/fail.png'
        this.lollipop = new Image();
        this.lollipop.src = '/imgs/pop/lollipop_alt.png'
        
        /*this.lollipops = [new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image()]
        for (var i = 0; i < this.lollipops.length; i++) {
            this.lollipops[i].src = '/imgs/pop/lollipop'+i+'.png'
        }*/

        this.springs = {
            off_tiles: [],
            on_tiles: [],
            arr:[]
        }
        for (var i = 0; i < 22; i++) { 
            let img = new Image();
            let num = (i+'').padStart(3, '0');
            img.src = '/imgs/spring/spring'+num+'.png';
            if (i < 4) {
                this.springs.on_tiles.push(img)
            } else {
                this.springs.off_tiles.push(img)
            }
        }

        this.spring_coords = this.get_grid_coords(5);
        for (var i = 0; i < this.spring_coords.length; i++) {
            this.springs.arr.push({
                'off':false,
                'oni': 0,
                'offi':0,
                'x': this.spring_coords[i].x * bw,
                'y': (this.spring_coords[i].y * bh),
                'last_mod':0
            });
        }
        
        /*
        this.spikes = { 
            'tiles':[new Image(), new Image(), new Image(), new Image(), new Image(), new Image()],
            'off': new Image(),
            'isoff': false,
            'arr': [],
            'last_mod':0
        }
        this.spikes.off.src = '/imgs/spikes/s.png'
        for (var i = 0; i < this.spikes.tiles.length; i++) {
            this.spikes.tiles[i].src = '/imgs/spikes/s'+i+'.png'
        }

        this.spike_coords = this.get_grid_coords(5);

        for (var i = 0; i < this.spike_coords.length; i++) {
            this.spikes.arr.push({
                'off':false,
                'i': 0,
                'x': this.spike_coords[i].x * bw,
                'y': (this.spike_coords[i].y * bh) - 24 // we need it to be 48 px not 72
            });
        }
        */
        
        this.lever_coords = this.get_grid_coords(6);
        this.levers = {
            'on': new Image(),
            'off': new Image(),
            'arr': []
        }
        // need to add code for every lever we add to grid.
        // levers(0).answer(levers(0).data() + 2)
        this.lever_code = [

        ]

        this.levers.on.src = '/imgs/lever/on.png'
        this.levers.off.src = '/imgs/lever/off.png'

        for (var i = 0; i < this.lever_coords.length; i++) {
            this.lever_code[i].x = this.lever_coords[i].x;
            this.lever_code[i].y = this.lever_coords[i].y;
            this.levers.arr.push({
                'off':false,
                'x': this.lever_coords[i].x * bw,
                'y': (this.lever_coords[i].y * bh)
            });
        }
        for (var i = 0; i < this.lever_code.length; i++) {
            this.lever_code[i].data.toString = function() {return ''};
            this.lever_code[i].answer.toString = function() {return ''};
            Object.freeze(this.lever_code[i]);
            // need to clone interactible in-game objects from here.
            var html = btoa("<div class='modal-content'><div class='modal-header'><span class='close closemodal'>&times;</span><h2 id='modal_header' style='text-align: center;'>LEVER #"+i+" OBJECTIVE:</h2></div><div class='modal-body'>"+marked('**Objective:**<br>')+this.lever_code[i].question+marked("**Note**<br><br>If you submit a correct answer to `elf.pull_lever(answer)`, then the lever and its corresponding trap will be disabled. <br><br>In order to run `elf.pull_lever(answer)` with lever *(#"+i+")*, you **must** be standing in its grid square located at *(x"+this.lever_code[i].x+',y'+this.lever_code[i].y+")*.<br><br>You **must** specify the lever number when using `elf.get_lever(0)`")+"<br></div></div>");
            var cont = '<div class="pixel interact_cont lever" onclick="open_modal('+i+', false, `'+html+'`)"><span>'+i+'</span></div>';
            $('#ingame_objects_body').append(cont); 
        }
        Object.freeze(this.lever_code);
        this.blocks = ['/imgs/blk/block1.png','/imgs/blk/block2.png','/imgs/blk/block3.png','/imgs/blk/block4.png','/imgs/blk/block5.png']
        for (var i = 0; i < this.blocks.length; i++) {
            let src = this.blocks[i]+'';
            this.blocks[i] = new Image();
            this.blocks[i].src = src;
        }
        Object.freeze(this.blocks);
        this.end_circle = {
            'min':24,
            'max':40,
            'cur':40,
            'last_mod':0,
            'shrink': true
        }
        this.load_images_then_animate();
    }
    draw_numof_funcs_used(){
        var wintext = "Completed in " + this.elfFuncCallUsed + ' elf statements.';
        var x = (canvas_square_size/2) - ((20 * wintext.length) /4)
        var y = canvas_square_size
        this.drawBoxAt(0, y - 20 , "rgba(255, 255, 255, 1.0)", canvas_square_size, 20)
        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "20px 'Roboto Mono', monospace";
        ctx.fillText(wintext, x, y-4);
        ctx.restore();
    }

    draw_text_to_grid(x, y, text) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.fillText(text, x, y);
        ctx.restore();
    }
    get_munchkin_coords() {
        let munches = [];
        for (let i = 0; i < this.munchkin.munchkins.length; i++) {
            munches.push({
                x:this.munchkin.munchkins[i].moveto_grid.x,
                y:this.munchkin.munchkins[i].moveto_grid.y,
                num:20 + i
            });
        }
        return munches
    }
    get_vars(){
        var elf = {
            'moveUp':this.moveUp.bind(this),
            'moveDown':this.moveDown.bind(this),
            'moveLeft':this.moveLeft.bind(this),
            'moveRight':this.moveRight.bind(this),
            'moveTo':this.moveTo.bind(this),
            'get_lever':this.get_lever.bind(this),
            'pull_lever':this.pull_lever.bind(this),
            'tell_munch':this.tell_munch.bind(this),
            'ask_munch':this.ask_much.bind(this)
        }
        return {
            'elf':elf,
            'lollipop':this.lollipop_coords,
            'lever':this.lever_coords,
            'pit':this.pit_coords,
            'yeeter':this.spring_coords,
            'munchkin':this.get_munchkin_coords()
        }
    };

    win_or_lose() {
        if (!this.dead && this.game_grid[ this.cur_xy.y ][ this.cur_xy.x ] === 4) {
            if (this.lollipop_coords.length) {
                ctx.drawImage( this.fail, 0, 0);
                canvas.onclick = function() {
                    canvas.onclick = null;
                    EnableDisableBtn();
                    _elphgame = new Game();
                }
            } else {
                ctx.drawImage( this.win, 0, 0);
                this.draw_numof_funcs_used()
                canvas.onclick = function() {
                    eval(atob("d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2xldmVsMl84NDY1NDU2MjE0MjYwNzY1Lz9yZXNvdXJjZUlkPScgKyByZXNvdXJjZUlk"))
                }   
            }
            return true;
        } else if (this.alpha < 0) {
            ctx.drawImage( this.lose, 0, 0);
            canvas.onclick = function() {
                canvas.onclick = null;
                EnableDisableBtn();
                _elphgame = new Game();
            }
            return true;
        }
        return false;
    }

    __an__(time) {
        this.cur_xy = {'x':Math.round( this.x / bw ),'y':Math.round( this.y / bh )}
        if (this.win_or_lose()) return;
        requestAnimationFrame(this.__an__.bind(this));
        // Calculations to ensure objects move at same appeared rates in dif browsers faster/slower comps
        this.delta = (time - this.last_time) / this.frames;
        //console.log(this.delta);
        this.last_time = time;
        //see how close we are to the center of map
        //const dist = Math.hypot( (canvas_square_size/2) - this.x, (canvas_square_size/2) - this.y );
        /*if (dist - this.radius - (bh/2) < 1) {
            // If block radius and player radius intersect then there is a collision
            //console.log(dist)
        }*/
        if (false) { return }
        // check if we are in lollipop grid 
        if (!this.dead && this.game_grid[ this.cur_xy.y ][ this.cur_xy.x ] === 2) {
            for (var i = 0; i < this.lollipop_coords.length; i++) {
                if (this.lollipop_coords[i].x === this.cur_xy.x && this.lollipop_coords[i].y === this.cur_xy.y ) {
                    this.lollipop_coords.splice(i, 1);
                    this.found_lollipop_coords.push( {'x': this.cur_xy.x+0,'y': this.cur_xy.x+0} );
                    $('#lollipops_collected').append('<div class="pixel collected"><span></span></div>');
                    break;
                }
            }
        } else if (!this.dead && this.game_grid[ this.cur_xy.y ][ this.cur_xy.x ] === 5) {
            for (var i = 0; i < this.spring_coords.length; i++) {
                if (this.spring_coords[i].x === this.cur_xy.x && this.spring_coords[i].y === this.cur_xy.y ) {
                    if (!this.springs.arr[i].off) {
                        this.dead = true;
                        this.spring_dead = true;
                        this.springs.arr[i].off = true;
                    }
                    break;
                }
            }
            /*
            for (var i = 0; i < this.spike_coords.length; i++) {
                if (this.spike_coords[i].x === this.cur_xy.x && this.spike_coords[i].y === this.cur_xy.y ) {
                    if (!this.spike_coords[i].off) {
                        this.dead = true;
                    }
                    break;
                }
            }*/
        } else if (!this.dead && this.game_grid[ this.cur_xy.y ][ this.cur_xy.x ] > 19) {
            let munch_index = this.game_grid[ this.cur_xy.y ][ this.cur_xy.x ] - 20;
            let munchkin = this.munchkin.munchkins[munch_index];
            if (!munchkin.friendly && !munchkin.dead) {
                this.dead = true;
            }
            //Check if they stepped on a pit
        } else if (!this.dead && [10,11,12,13].includes( this.game_grid[ this.cur_xy.y ][ this.cur_xy.x ] )) {
            for (var i = 0; i < this.pit.arr.length; i++) {
                if (!this.pit.arr[i].up && this.pit.arr[i].gx === this.cur_xy.x && this.pit.arr[i].gy === this.cur_xy.y ) {
                    this.dead = true;
                    break
                }
            }
        }
        

        if (this.y == this.dest_y && this.x == this.dest_x) {
            if (this.moving) {
                this.moving = false;
            }
            if (this.actions.length) {
                var action = this.actions[0]
                this.actions.shift();
                //console.log(action)
                action[0](action[1])
            } else if (this.game_started && !this.moving) {
                // this will end the game if they run out of moves
                this.alpha = -1
            }
        }

        //this.clear();
        if (!this.dead) {
            if (this.y < this.dest_y) {
                this.y = Math.min(this.dest_y, this.y + (this.speed * this.delta));
            } else if (this.y > this.dest_y) {
                this.y = Math.max(this.dest_y, this.y - (this.speed * this.delta));
            } else if (this.x < this.dest_x) {
                this.x = Math.min(this.dest_x, this.x + (this.speed * this.delta));
            } else {
                this.x = Math.max(this.dest_x, this.x - (this.speed * this.delta));
            }   
        }
        let y_remain = Math.abs(this.dest_y - this.y);
        let x_remain = Math.abs(this.dest_x - this.x);
        let distance = Math.max(y_remain, x_remain) % bh;
        // Only 4 frames so out of so out of 48 thats 12. -1 since we are targeting the index
        this.anims[ this.dir + 'i' ] = Math.max(0, Math.round(( distance /12 )-1));
        this.draw();
    }

    get_grid_coords(from,to) {
        let matching_coords = [];
        for (var y = 0; y < this.game_grid.length; y++) {
            for (var x = 0; x < this.game_grid.length; x++) {
                if (typeof to === "undefined" && this.game_grid[y][x] === from) {
                    matching_coords.push({'x':x,'y':y,'num':this.game_grid[y][x]});
                } else if (this.game_grid[y][x] >= from && this.game_grid[y][x] < to) {
                    matching_coords.push({'x':x,'y':y,'num':this.game_grid[y][x]});
                }
            }
        }
        return matching_coords
    }

    get_lever(num) {
        if (!this.lever_code[num]) {console_callback('error',num + ' is not a valid lever number. For example: elf.get_lever(0)'); return}
        return this.lever_code[num].data();
    }

    pull_lever(val) {
        if (this.moving || false) {
            return
        } else {
            this.actions.push([this.__pl__.bind(this), val]);
        }
    }

    __pl__(val) {
        for (var i = 0; i < this.lever_code.length; i++) {
            if (this.lever_code[i].x === this.cur_xy.x && this.lever_code[i].y === this.cur_xy.y ) {
                return this.lever_code[i].answer(val);
            }
        }
    }

    ask_much(num) {
        if (!this.munchkin.munchkins[num]) {console_callback('error',num + ' is not a valid munchkin number. For example: elf.ask_munch(0)'); return}
        return this.munchkin.munchkins[num].code.data();
    }

    tell_munch(val) {
        if (this.moving || false) {
            return
        } else {
            this.actions.push([this.__tm__.bind(this), val]);
        }
    }

    __tm__(val) {
        let closest_distance = canvas_square_size*2;
        let closest_munchkin = false;
        for (var i = 0; i < this.munchkin.munchkins.length; i++) {
            if (this.munchkin.munchkins[i].dead || this.munchkin.munchkins[i].friendly) {continue}
            if (Math.abs( this.munchkin.munchkins[i].cur_xy.x - this.cur_xy.x ) <= 1 && Math.abs( this.munchkin.munchkins[i].cur_xy.y - this.cur_xy.y) <= 1 ) {
                let distance = Math.hypot( this.munchkin.munchkins[i].x - this.x, this.munchkin.munchkins[i].y - this.y )
                if (distance < closest_distance) {
                    closest_distance = distance;
                    closest_munchkin = this.munchkin.munchkins[i];
                }
            }
        }
        if (closest_munchkin) {
            return closest_munchkin.code.answer(val);
        } else {
            console_callback('error', 'You are not close enough to any munchkin to tell them an answer.')
        }
    }

    __mu__(grids=1) {
        if (this.moving || false) {
            return
        } else {
            this.dir = 'n'
            this.moving = true;
            let desired_gridy = Math.max(0, this.dest_gridy - grids);
            let current_gridx = this.x / bw;
            let current_gridy = this.y / bh;
            let real_gridy = current_gridy+0;
            // Basically, we are validating that tile is walkable
            for (var i = current_gridy-1; i >= desired_gridy; i--) {
                if ( this.game_grid[i][current_gridx] > 0 ) {
                    real_gridy = Math.max(0, i);
                } else {
                    break
                }
            }
            this.dest_gridy  = real_gridy;
            this.dest_y = this.dest_gridy * bw;
        }
    }

    moveUp(grids=1) {
        if (this.moving || false) {
            return
        } else {
            this.actions.push([this.__mu__.bind(this), grids]);
        }
    }

    __md__(grids=1) {
        if (this.moving || false) {
            return
        } else {
            this.dir = 's'
            this.moving = true;
            let desired_gridy = Math.min(num_of_rows_columns - 1, this.dest_gridy + grids);
            let current_gridx = this.x / bw;
            let current_gridy = this.y / bh;
            let real_gridy = current_gridy+0;
            // Basically, we are validating that tile is walkable
            for (var i = current_gridy+1; i <= desired_gridy; i++) {
                if ( this.game_grid[i][current_gridx] > 0 ) {
                    real_gridy = Math.min(num_of_rows_columns - 1, i);
                } else {
                    break
                }
            }
            this.dest_gridy  = real_gridy;
            this.dest_y = this.dest_gridy * bw;
        }
    }

    moveDown(grids=1) {
        if (this.moving || false) {
            return
        } else {
            this.actions.push([this.__md__.bind(this), grids]);
        }
    }

    __ml__(grids=1) {
        if (this.moving || false) {
            return
        } else {
            this.dir = 'w'
            this.moving = true;
            let desired_gridx = Math.max(0, this.dest_gridx - grids);
            let current_gridx = this.x / bw;
            let current_gridy = this.y / bh;
            let real_gridx = current_gridx+0;
            // Basically, we are validating that tile is walkable
            for (var i = current_gridx-1; i >= desired_gridx; i--) {
                if ( this.game_grid[current_gridy][i] > 0 ) {
                    real_gridx = Math.max(0, i);
                } else {
                    break
                }
            }
            this.dest_gridx  = real_gridx;
            this.dest_x = this.dest_gridx * bw;
        }
    }

    moveLeft(grids=1) {
        if (this.moving || false) {
            return
        } else {
            this.actions.push([this.__ml__.bind(this), grids]);
        }
    }
    
    __mr__(grids=1) {
        if (this.moving || false) {
            return
        } else {
            this.dir = 'e'
            this.moving = true;
            let desired_gridx = Math.min(num_of_rows_columns - 1, this.dest_gridx + grids);
            let current_gridx = this.x / bw;
            let current_gridy = this.y / bh;
            let real_gridx = current_gridx+0;
            // Basically, we are validating that tile is walkable
            for (var i = current_gridx+1; i <= desired_gridx; i++) {
                if ( this.game_grid[current_gridy][i] > 0 ) {
                    real_gridx = Math.min(num_of_rows_columns - 1, i);
                } else {
                    break
                }
            }
            this.dest_gridx  = real_gridx;
            this.dest_x = this.dest_gridx * bw;
        }
    }

    get_path(dest_grid_coord, cur_xy, moves=0) {
        let real_gridx = cur_xy.x+0;
        let real_gridy = cur_xy.y+0;
        let safe_grids = [1,2,3,4,6,10,12]

        //probably could have turned this into a function but meh
        if (dest_grid_coord.x < cur_xy.x){
            for (var i = cur_xy.x-1; i >= dest_grid_coord.x; i--) {
                if ( safe_grids.includes(this.game_grid[cur_xy.y][i]) ) {
                    real_gridx = i
                } else {
                    break
                }
            }
        } else if (dest_grid_coord.x > cur_xy.x){
            for (var i = cur_xy.x+1; i <= dest_grid_coord.x; i++) {
                if ( safe_grids.includes(this.game_grid[cur_xy.y][i])) {
                    real_gridx = i
                } else {
                    break
                }
            }
        }
        if (dest_grid_coord.y < cur_xy.y){
            for (var i = cur_xy.y-1; i >= dest_grid_coord.y; i--) {
                if ( safe_grids.includes(this.game_grid[i][cur_xy.x]) ) {
                    real_gridy = i
                } else {
                    break
                }
            }
        } else if (dest_grid_coord.y > cur_xy.y){
            for (var i = cur_xy.y+1; i <= dest_grid_coord.y; i++) {
                if ( safe_grids.includes(this.game_grid[i][cur_xy.x]) ) {
                    real_gridy = i
                } else {
                    break
                }
            }
        }
        let dstx = {'x':cur_xy.x,'y':real_gridy}
        let dsty = {'x':real_gridx,'y':cur_xy.y}
        // we dont want super advanced path finding that takes them all the way home cause that would defeat the purpose.
        // just want two moves max but avoiding obstacles that get us the closest to our destination object grid coordinates
        if (!moves) {
            let xpath = this.get_path(dest_grid_coord, dstx, moves=1)
            let ypath = this.get_path(dest_grid_coord, dsty, moves=1)
            
            let dist_from_dest_on_xpath_y = Math.hypot( dest_grid_coord.x - xpath.y.x, dest_grid_coord.y - xpath.y.y );
            let dist_from_dest_on_ypath_y = Math.hypot( dest_grid_coord.x - ypath.y.x, dest_grid_coord.y - ypath.y.y );
            let dist_from_dest_on_xpath_x = Math.hypot( dest_grid_coord.x - xpath.x.x, dest_grid_coord.y - xpath.x.y );
            let dist_from_dest_on_ypath_x = Math.hypot( dest_grid_coord.x - ypath.x.x, dest_grid_coord.y - ypath.x.y );
            let arr = [dist_from_dest_on_xpath_y, dist_from_dest_on_ypath_y, dist_from_dest_on_xpath_x, dist_from_dest_on_ypath_x]
            var min = Math.min.apply(Math, arr)
            if (dist_from_dest_on_xpath_y === min) {
                return [dstx,xpath.y]
            } else if (dist_from_dest_on_ypath_y === min) { 
                return [dsty,ypath.y]
            } else if (dist_from_dest_on_xpath_x === min) { 
                return [dstx,xpath.x]
            } else {
                return [dsty,ypath.x]
            }

        } else {
            return {
                x:dstx,
                y:dsty,
            }
        }
        
    }
    __mt__(dest_grid_coord) {
        if ( this.cur_xy.x === dest_grid_coord.x && this.cur_xy.y === dest_grid_coord.y) {return}
        let path = this.get_path(dest_grid_coord, this.cur_xy)
        let last_xy = {
            x:this.cur_xy.x+0,
            y:this.cur_xy.y+0
        }
        var actions = []
        for (let i = 0; i < path.length; i++) {
            if (path[i].x > last_xy.x) {
                actions.push( [this.__mr__.bind(this), path[i].x - last_xy.x] );
            } else if (path[i].x < last_xy.x) {
                actions.push( [this.__ml__.bind(this), last_xy.x - path[i].x] );
            } else if (path[i].y > last_xy.y) { 
                actions.push( [this.__md__.bind(this), path[i].y - last_xy.y] );
            } else if (path[i].y < last_xy.y) {
                actions.push( [this.__mu__.bind(this), last_xy.y - path[i].y] );
            }
            last_xy.x = path[i].x+0;
            last_xy.y = path[i].y+0;
        }
        for (let i = actions.length-1; i >= 0; i--) {
            this.actions.unshift(actions[i])
        }
    }

    moveTo(dest_grid_coord) {
        if (this.moving || false) {
            return
        } else {
            if (!('x' in dest_grid_coord) || !('y' in dest_grid_coord)) {
                console_callback('error', 'provided moveTo(object) is not a valid in-game object')
                return
            } else {
                this.actions.push([this.__mt__.bind(this), dest_grid_coord]);
            }
        }
    }

    moveRight(grids=1) {
        if (this.moving || false) {
            return
        } else {
            this.actions.push([this.__mr__.bind(this), grids]);
        }
    }

    /*clear() {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out'
        ctx.arc(this.x, this.y, this.radius+1, 0, Math.PI*2, true);
        ctx.fill();
    }*/

    draw_end_circle(){
        if (this.last_time > this.end_circle.last_mod + 50) {
            this.end_circle.last_mod = this.last_time + 0;
            if (this.end_circle.shrink) {
                if (this.end_circle.cur === this.end_circle.min) {
                    this.end_circle.shrink = false;
                    this.end_circle.cur += 1;
                } else {
                    this.end_circle.cur -= 1;
                }
            } else {
                if (this.end_circle.cur === this.end_circle.max) {
                    this.end_circle.shrink = true;
                    this.end_circle.cur -= 1;
                } else {
                    this.end_circle.cur += 1;
                }
            }
        }
        ctx.save();
        ctx.beginPath();
        var radius = Math.round(this.end_circle.cur / 2);
        var offset = bw / 2;
        ctx.arc((this.end_coords.x * bw) + offset, (this.end_coords.y * bh) + offset, radius,
            0, Math.PI * 2, false
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    drawGrid(){
        for (let c=0; c <= num_of_rows_columns; c++) { 
            for (let r=0; r <= num_of_rows_columns; r++) { 
                let roffset = r * bh;
                let coffset = c * bw;
                ctx.beginPath();
                ctx.moveTo(0.5 + roffset + p, p);
                ctx.lineTo(0.5 + roffset + p, canvas_square_size + p);
                ctx.moveTo(p, 0.5 + coffset + p);
                ctx.lineTo(canvas_square_size + p, 0.5 + coffset + p);
    
                //ctx.strokeStyle = "#3399ff";
                ctx.strokeStyle = "#b3d7ff";
                ctx.stroke();
            }
        }
    }
    /*
    draw_spikes() {
        for (var i = 0; i < this.spikes.arr.length; i++) {
            var spike = this.spikes.arr[i];
            if (spike.off) {
                ctx.drawImage( this.spikes.off, spike.x, spike.y);
            } else {
                var index = Math.round( spike.i % this.spikes.tiles.length)
                ctx.drawImage( this.spikes.tiles[ index ], spike.x, spike.y);
                if (this.last_time > this.spikes.last_mod + 100) {
                    this.spikes.last_mod = this.last_time + 0;
                    this.spikes.arr[i].i += 1;
                }
            }
        }
    }*/

    draw_springs() {
        for (var i = 0; i < this.springs.arr.length; i++) {
            let spring = this.springs.arr[i];
            if (spring.off) {
                let ind = Math.min(this.springs.off_tiles.length-1, spring.offi);
                ctx.drawImage( this.springs.off_tiles[ ind ], spring.x, spring.y);
                if (this.last_time > spring.last_mod + 100) {
                    spring.last_mod = this.last_time + 0;
                    spring.offi += 1;
                }
            } else {
                let ind = Math.round( spring.oni % this.springs.on_tiles.length)
                ctx.drawImage( this.springs.on_tiles[ ind ], spring.x, spring.y);
                if (this.last_time > spring.last_mod + 100) {
                    spring.last_mod = this.last_time + 0;
                    spring.oni += 1;
                }
            }
        }
    }

    death_animation() {
        ctx.save();

        var img = this.anims[ 'd' ];

        if (this.spring_dead) {
            var y_offset = Math.round(img.naturalHeight/2);

            ctx.translate(this.x, this.y + y_offset); 
            ctx.rotate(this.rotation);
    
            var x = -Math.round(img.naturalWidth/2);
            var y = -y_offset;
            ctx.drawImage( img, x, y);
            if (typeof this.spring_dir == "undefined") {
                if (this.x < canvas_square_size/2) {
                    this.spring_dir = 2;
                } else if (this.x > canvas_square_size/2) {
                    this.spring_dir = -2;
                }
            }
            this.x += this.spring_dir * this.delta;
            this.y += -Math.abs(this.spring_dir) * this.delta;
        } else {
            ctx.globalAlpha = Math.max(0, this.alpha);
            var y_offset = Math.round(img.naturalHeight/2);

            ctx.translate(this.x, this.y + y_offset); 
            ctx.rotate(this.rotation);
    
            var x = -Math.round(img.naturalWidth/2);
            var y = -y_offset;
            ctx.drawImage( img, x, y);
        }

        this.alpha -= 0.005 * this.delta;
        this.rotation += 0.1 * this.delta;

        ctx.restore();
    }

    draw_levers() {
        for (var i = 0; i < this.levers.arr.length; i++) {
            var lever = this.levers.arr[i];
            if (lever.off) {
                ctx.drawImage( this.levers.off, lever.x, lever.y);
            } else {
                ctx.drawImage( this.levers.on, lever.x, lever.y);
            }
            this.draw_text_to_grid(lever.x+2, lever.y + bh, i+'')
        }
    }
    
    // Should probably use same func for elf death anim but too lazy 
    munchkin_death(munchkin) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, munchkin.alpha);

        var img = this.munchkin.anims[ 'd' ];

        var y_offset = Math.round(img.naturalHeight/2);

        ctx.translate((munchkin.cur_xy.x * bw) + (img.naturalWidth/2) , (munchkin.cur_xy.y *bh) + y_offset); 
        ctx.rotate(munchkin.rotation);

        var x = -Math.round(img.naturalWidth/2);
        var y = -y_offset;
        ctx.drawImage( img, x, y);

        munchkin.alpha -= 0.005 * this.delta;
        munchkin.rotation += 0.1 * this.delta;

        ctx.restore();
    }
    
    draw_munchkins() {
        this.munchkin.munchkins.forEach(function(munchkin, i) {
            
            // We need these to see which direction we are moving in
            let last_x = munchkin.x +0;
            let last_y = munchkin.y +0;
            // if munchkin hasnt ever been started then we initialize it here
            if (munchkin.x === -1 && munchkin.y === -1) {
                munchkin.x = munchkin.grid_path[ munchkin.gi ].x * bw;
                munchkin.y = munchkin.grid_path[ munchkin.gi ].y * bh;
                munchkin.cur_xy = {'x': Math.round( munchkin.x / bw ), 'y': Math.round( munchkin.y / bh )}
                munchkin.last_grid_num = this.game_grid[ munchkin.cur_xy.y ][ munchkin.cur_xy.x ] + 0
                last_x = munchkin.x +0;
                last_y = munchkin.y +0;
            } else {
                // set our old game grid back to normal
                if (this.game_grid[ munchkin.cur_xy.y ][ munchkin.cur_xy.x ] !== munchkin.last_grid_num) {
                    this.game_grid[ munchkin.cur_xy.y ][ munchkin.cur_xy.x ] = munchkin.last_grid_num + 0
                }

                if (!munchkin.dead && [10,11,12,13].includes( this.game_grid[ munchkin.cur_xy.y ][ munchkin.cur_xy.x ] )) {
                    for (var h = 0; h < this.pit.arr.length; h++) {
                        if (!this.pit.arr[h].up && this.pit.arr[h].gx === munchkin.cur_xy.x && this.pit.arr[h].gy === munchkin.cur_xy.y ) {
                            munchkin.dead = true;
                            break
                        }
                    }
                }

                // play animation and exit. Need need to animate if dead
                if (munchkin.dead)  {
                    if (munchkin.alpha > 0) {
                        this.munchkin_death(munchkin);
                    }
                    return;
                }
                // Otherwise, we need to get the next destination grid
                let next_grid_index = munchkin.gi + 1;
                if (next_grid_index >= munchkin.grid_path.length)  {
                    next_grid_index = 0;
                }
                // convert that to destination x/y coords.
                let next_grid_x = munchkin.grid_path[ next_grid_index ].x * bw;
                let next_grid_y = munchkin.grid_path[ next_grid_index ].y * bh;
                
                // Update our x / y towards the next grid
                if (munchkin.y < next_grid_y) {
                    munchkin.y = Math.min(next_grid_y, munchkin.y + (munchkin.speed * this.delta));
                } else if (munchkin.y > next_grid_y) {
                    munchkin.y = Math.max(next_grid_y, munchkin.y - (munchkin.speed * this.delta));
                } else if (munchkin.x < next_grid_x) {
                    munchkin.x = Math.min(next_grid_x, munchkin.x + (munchkin.speed * this.delta));
                } else {
                    munchkin.x = Math.max(next_grid_x, munchkin.x - (munchkin.speed * this.delta));
                }

                // If we have reached our next grid then we set it as our current grid index
                if (munchkin.x === next_grid_x && munchkin.y === next_grid_y) {
                    munchkin.gi = next_grid_index;
                }
            }
            
            // get movement direction
            if (munchkin.x > last_x) {
                munchkin.dir = 'e';
            } else if (munchkin.x < last_x) {
                munchkin.dir = 'w';
            } else if (munchkin.y < last_y) {
                munchkin.dir = 'n';
            } else if (munchkin.y > last_y) {
                munchkin.dir = 's';
            }
            // set our new current grid
            munchkin.cur_xy = {'x': Math.round( munchkin.x / bw ), 'y': Math.round( munchkin.y / bh )}
            // then set the new game grid to be associated with our munchkin 20 + munchkin index number
            if (!munchkin.friendly) {
                munchkin.last_grid_num = this.game_grid[ munchkin.cur_xy.y ][ munchkin.cur_xy.x ] + 0;
                this.game_grid[ munchkin.cur_xy.y ][ munchkin.cur_xy.x ] = 20 + i;
            }
            // Check if animation speed has gone by to update animation speed
            if (this.last_time > munchkin.last_mod + this.munchkin.animspeed) { 
                munchkin.last_mod = this.last_time + 0;
                munchkin.ai += 1   
            }
            // calculate our new animation index number
            let anim_index = Math.round( munchkin.ai % this.munchkin.anims[munchkin.dir].length)
            // draw red box that munchkin is in:
            if (munchkin.friendly) { 
                this.drawBoxAt(munchkin.cur_xy.x * bw, munchkin.cur_xy.y * bh, 'rgba(0, 255, 153, 0.15)');
            } else {
                this.drawBoxAt(munchkin.cur_xy.x * bw, munchkin.cur_xy.y * bh);
            }
            // draw munchkin to screen
            ctx.drawImage( this.munchkin.anims[munchkin.dir][anim_index], munchkin.x, munchkin.y);
            this.draw_text_to_grid(munchkin.x + 2, munchkin.y + this.munchkin.anims[munchkin.dir][anim_index].naturalHeight - 2, i)
        }.bind(this));
    }
    
    drawBoxAt(x, y, color="rgba(255, 179, 179, 0.3)", wid=48, hei=48){
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, wid, hei);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    draw_pits() {
        for (let i =0; i < this.pit.arr.length; i++) {
            if (this.pit.arr[i].up) {
                ctx.drawImage( this.pit.arr[i].u , this.pit.arr[i].x, this.pit.arr[i].y);
            } else {
                ctx.drawImage( this.pit.arr[i].d , this.pit.arr[i].x, this.pit.arr[i].y);
            }
        }
    }

    draw() {
        // clear our screen then draw the end cirlc and grid
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.draw_end_circle();

        this.draw_pits();
        
        this.drawGrid();

        // draw all blocks on screen
        this.block_coords.forEach(function(block_coord) {
            let img = this.blocks[ Math.abs(this.game_grid[block_coord.y][block_coord.x]) - 1 ];
            ctx.drawImage( img , block_coord.x * bw, block_coord.y * bh);
        }.bind(this));

        // draw all lollipops on screen
        this.lollipop_coords.forEach(function(lol_coord, i) {
            let x = lol_coord.x * bw;
            let y = lol_coord.y * bh;
            this.draw_text_to_grid(x + 2, y + this.lollipop.naturalHeight - 2, i+'')
            ctx.drawImage( this.lollipop , x, y);
        }.bind(this));

        // draw spikes on screen
        //this.draw_spikes();

        // draw levers on screen
        this.draw_levers();

        // draw springs
        this.draw_springs();
        
        //draw the munchy ones
        this.draw_munchkins();

        if (!this.dead) {
            ctx.drawImage( this.anims[ this.dir ][ this.anims[ this.dir + 'i' ] ] , this.x, this.y);
        } else {
            this.death_animation();
        }
    }
    
    IsImageLoaded(img) {
        if (!img.complete) {
            return false;
        }
        if (img.naturalWidth === 0) {
            return false;
        }
        return true;
    }

    load_image(obj, loaded, char) {
        for (var i = 0; i < obj[char].length; i++) {
            if (typeof obj[char][i] === 'string') {
                let imgsrc = obj[char][i] + '';
                obj[char][i] = new Image();
                obj[char][i].src = imgsrc;
            } else if (this.IsImageLoaded(obj[char][i]))  {
                loaded.push(true);
            }
        }
    }

    load_images_then_animate() {
        var loaded = []
        this.load_image(this.anims, loaded, 'n');
        this.load_image(this.anims, loaded, 's');
        this.load_image(this.anims, loaded, 'e');
        this.load_image(this.anims, loaded, 'w');
        this.load_image(this.munchkin.anims, loaded, 'n');
        this.load_image(this.munchkin.anims, loaded, 's');
        this.load_image(this.munchkin.anims, loaded, 'e');
        this.load_image(this.munchkin.anims, loaded, 'w');
        if (loaded.length === this.anims['n'].length + this.anims['s'].length + this.anims['w'].length + this.anims['e'].length + this.munchkin.anims['n'].length + this.munchkin.anims['s'].length + this.munchkin.anims['w'].length + this.munchkin.anims['e'].length) {
            this.draw();
            requestAnimationFrame(this.__an__.bind(this));
        } else {
            setTimeout(this.load_images_then_animate.bind(this), 100);
        }
    }
}
function evalgame(user_code){
    EnableDisableBtn();
    var sccAwiaicSaX2YoR = _elphgame.get_vars();
    _elphgame.game_started = true
    var elf = sccAwiaicSaX2YoR.elf;
    var lollipop = sccAwiaicSaX2YoR.lollipop;
    var lever = sccAwiaicSaX2YoR.lever;
    var pit = sccAwiaicSaX2YoR.pit;
    var yeeter = sccAwiaicSaX2YoR.yeeter;
    var munchkin = sccAwiaicSaX2YoR.munchkin;
    eval(user_code);
}

function allNodes(obj, key, value, array) {
    array = array || [];
    if ('object' === typeof obj && !Array.isArray(obj)) {
        for (let k in obj) {
            if (k === key && obj[k] === value) {
                array.push(obj);
            } else {
                allNodes(obj[k], key, value, array);
            }
        }
    } else if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) { 
            if ('object' === typeof obj[i]) {
                allNodes(obj[i], key, value, array);
            }
        }
    }
    return array;
}

function recurse_object_property_properties(obj, targ_func_names, var_name) {
    if ('name' in obj && targ_func_names.includes(obj.name)) {
        targ_func_names.push(var_name);
    } else if ('object' in obj && targ_func_names.includes(obj.object.name)) { 
        targ_func_names.push(var_name);
    } else if ('property' in obj && targ_func_names.includes(obj.property.name)) { 
        targ_func_names.push(var_name);
    } else if ('properties' in obj) { 
        for (var h = 0; h < obj.properties.length; h++) {
            recurse_object_property_properties(obj.properties[h].value, targ_func_names, var_name)
        }
    } else if ('elements' in obj) {
        for (var h = 0; h < obj.elements.length; h++) {
            recurse_object_property_properties(obj.elements[h], targ_func_names, var_name)
        }
    }
}

function recurse_object_property_properties_for_funcs(obj, user_funcs) {
    if ('name' in obj) {
        user_funcs.push(obj.name);
    } else if ('object' in obj) { 
        user_funcs.push(obj.object.name);
    } else if ('property' in obj) { 
        user_funcs.push(obj.property.name);
    } else if ('properties' in obj) { 
        for (var h = 0; h < obj.properties.length; h++) {
            recurse_object_property_properties(obj.properties[h].value, user_funcs)
        }
    } else if ('elements' in obj) {
        for (var h = 0; h < obj.elements.length; h++) {
            recurse_object_property_properties(obj.elements[h], user_funcs)
        }
    }
}

function allObjectAndPropertyKeys(obj, targ_func_names) {
    if ('object' === typeof obj && !Array.isArray(obj)) {
        recurse_object_property_properties(obj.init, targ_func_names, obj.id.name)
    } else if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) { 
            if ('object' === typeof obj[i]) {
                allObjectAndPropertyKeys(obj[i], targ_func_names);
            }
        }
    }
}

function parseUserJS(user_string) {
    var parsed_data = acorn.loose.parse(user_string, {ecmaVersion: 2020});
    var var_declares = allNodes(parsed_data, 'type', 'VariableDeclarator');
    var limited_functions = Object.keys( _elphgame.get_vars().elf );
    limited_functions.push('elf');
    allObjectAndPropertyKeys(var_declares, limited_functions);
    var call_expressions = allNodes(parsed_data, 'type', "CallExpression");
    var user_function_calls = [];
    for (var i = 0; i < call_expressions.length; i++) {
        recurse_object_property_properties_for_funcs(call_expressions[i].callee, user_function_calls);
    }
    var total_matching = 0;
    user_function_calls.forEach(function(func, ind){
        if (limited_functions.includes(func)) {
            total_matching += 1;
        }
    });
    return total_matching
}

function open_modal(num, ishelp=true, html='') {
    var jmodal = $(modal);
    if (ishelp) {
        var src_modal = $('#modal'+num);
        jmodal.html(src_modal.html());
    } else {
        jmodal.html(atob(html));
    }
    jmodal.css('display','block');
}

function beautify_console(num=0) {
    var self = $($('.content')[0])
    var minLines = _elphgame.maxLines;
    // beautify the code
    var usercode = js_beautify(jseditor.getValue(), { indent_size: 2, })
    /*while (usercode.includes(", elf.")) {
        usercode = js_beautify(usercode.replace(", elf.", "\nelf."), { indent_size: 2, })
    }*/
    var lns = usercode.split('\n')
    var lines = [];
    for (var i=0; i < lns.length; i++) {
        if (!lns[i].includes('eval(')) {
            lines.push(lns[i]);
        }
    }
    lines.length = Math.min(lines.length, _elphgame.maxLines);
    var cur_line = jseditor.getCursor().line;
    var cur_char = jseditor.getCursor().ch;
    var lines_before = lines.length + 0;
    for (var i = 0; i < (minLines - lines_before); i++) {
        lines.push("");
    }
    jseditor.setValue(lines.join('\n'));
    // set minimum number of lines
    var minLines = _elphgame.maxLines;
    self.find(".editor").data('minLines', minLines);
    var lineCount = jseditor.lineCount(); // current number of lines

    var n = minLines - lineCount; // how many lines we need
    var line = jseditor.getCursor().line;
    for(i = 0; i < n; i++) {
        jseditor.replaceRange("\n", { line });
        line++;
    }
    if (num == 8) { 
        jseditor.setCursor({line:cur_line, ch:cur_char});
    } else {
        var cur_line_text = jseditor.getLine(cur_line);
        if (cur_line_text) {
            var char_offset = cur_line_text.length
            jseditor.setCursor({line:cur_line, ch:char_offset});
        } else {
            jseditor.setCursor({line:cur_line, ch:cur_char});
        }
    }
}

function runGame() {
    if (_elphgame.moving || false) { return }
    beautify_console();
    var user_code = jseditor.getValue().trim();
    if (user_code.length > 0) {
        var number_of_elf_funcs = parseUserJS(user_code);
        if (number_of_elf_funcs <= _elphgame.maxElfFuncCalls) {
            _elphgame.elfFuncCallUsed = number_of_elf_funcs+0;
            evalgame(user_code);   
        } else {
            console_callback('error', 'Too many elf commands used ('+number_of_elf_funcs+'). Max is '+_elphgame.maxElfFuncCalls + '.')
        }
    }
}

function EnableDisableBtn() {
    var btn = $('#runButton')
    if (btn.is(":disabled")) {
        btn.prop("disabled",false);
    } else {
        btn.prop("disabled",true);
    }
}

var console_callback = (category, args) => {

    // In a browser env you could write to a DOM element
    var nm = category+'';
    nm = nm.charAt(0).toUpperCase() + nm.slice(1)
    if (typeof args === 'object' && args !== null && "0" in args) {
        args = JSON.stringify(args["0"])
    }
    con.innerHTML += `<div class="console_entry"><div class="`+category+`">`+nm+`:
    </div><span class="clog_inner">`+args+`</span></div><br>`;
    con.scrollTop = con.scrollHeight;
};

function convert_markdown() {
    $('.modal-body').each(function(i, obj) {
        var elem = $(obj);
        var mkdn = elem.text();
        elem.html(marked(mkdn));
    });
}

// Modal we can use for displaying programming information
var modal = document.getElementById("menu_modal");
var con = document.getElementById('console_output');

var jseditor;
var _elphgame;

const urlVars = __PARSE_URL_VARS__(),
resourceId = urlVars.resourceId;
resourceId || console.error(atob('Tm8gcmVzb3VyY2UgSUQgcHJvdmlkZWQh'));

$(function() {
    _elphgame = new Game();

    convert_markdown();

    open_modal(8);
    // Modal to display programming info
    $(document).on('click', '.closemodal', function(){
        modal.style.display = "none";
    });

    $(document).on('click', '#menu_modal', function(e){
        if (e.target.id === 'menu_modal') {
            modal.style.display = "none";
        }
    });

    // Bind callback fn. Multiple functions can be bound.
    window.ConsoleSubscriber.bind(console_callback);
    window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
        console_callback('error', errorMsg);
        return false;
    }
    $('#clearconsole').click(function(){
        con.innerHTML = '';
    });
    $('#consoleexpand').click(function() {
        var jcon = $('#console');
        if (!jcon.hasClass('expanded')) {
            jcon.addClass('expanded');
        } else {
            jcon.removeClass('expanded');
        }
    });

    // JS editory
	var editorOptions = {
		autoRefresh: true,
		firstLineNumber: 1,
		lineNumbers: true,
		smartIndent: true,
		lineWrapping: false,
		indentWithTabs: true,
		refresh: true,
		mode: 'javascript'
    };
	$('.content').each(function() {
        var self = $(this);
		var editor = CodeMirror.fromTextArea(self.find(".editor")[0], editorOptions);
        self[0].editor = editor;
        jseditor = editor;
        editor.on("viewportChange", function(cm, changes) {
            //beautify_console();
        });
        editor.on("changes", function(cm, changes) {
            if (jseditor.lineCount() >= _elphgame.maxLines) {
                editor.replaceRange("", {
                    line: _elphgame.maxLines,
                    ch: 0
                }, {
                    line: _elphgame.maxLines + 1,
                    ch: 0
                });
            }
        });
		editor.save();
        
        beautify_console();
		
	});
	
	$(document).on('keydown', '.CodeMirror', function(e, change) {
        /*e = e || window.event;
        var key = e.which || e.keyCode; // keyCode detection
        var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false); // ctrl detection
        if ( key == 86 && ctrl ) {
            beautify_console(key);
        } else if (key === 8 || key === 13) {
            beautify_console(key);
        }*/
    });
    /*$(document).on("DOMNodeRemoved", '.CodeMirror-code', function(e){
        console.log(e.target.nodeName);
    });*/
    
    $('#runButton').click(function() {
        runGame();
    });
});
