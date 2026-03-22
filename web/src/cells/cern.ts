import { context } from "../canvas";
import { playOnce } from "../sound";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "../theme";
import { Cell, CellInput } from "./cell";

interface Vistar {
    key: string,
    name: string,
    img: string,
    refreshrate: string,
    ext_refreshrate: string,
    lgbk: string, // logbook id
}
const vistarData = {
  LARGER1: {
    name: "SPS LARGER 1",
    img: "https:\/\/vistar-capture.s3.cern.ch\/larger1.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "424",
  },
  CPS: {
    name: "CPS",
    img: "https:\/\/vistar-capture.s3.cern.ch\/cps.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "683",
  },
  GPS: {
    name: "GPS",
    img: "https:\/\/vistar-capture.s3.cern.ch\/gps.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "603",
  },
  HRS: {
    name: "HRS",
    img: "https:\/\/vistar-capture.s3.cern.ch\/hrs.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "605",
  },
  LEIR: {
    name: "LEIR",
    img: "https:\/\/vistar-capture.s3.cern.ch\/leir.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "642",
  },
  LHC1: {
    name: "LHC Page 1",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhc1.png",
    refreshrate: "8000",
    ext_refreshrate: "10000",
    lgbk: "322",
  },
  LHC2: {
    name: "LHC Cryogenics",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhc2.png",
    refreshrate: "8000",
    ext_refreshrate: "10000",
    lgbk: "322",
  },
  LHC3: {
    name: "LHC Operation",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhc3.png",
    refreshrate: "5000",
    ext_refreshrate: "5000",
    lgbk: "322",
  },
  LHCCOLLI: {
    name: "LHC Collimators Summary",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhccolli.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LHCCONFIG: {
    name: "LHC Configuration",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhcconfig.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LHCCMS: {
    name: "LHC CMS Experiment",
    img: "https:\/\/vistar-capture.s3.cern.ch\/cms.png",
    refreshrate: "15000",
    ext_refreshrate: "15000",
    lgbk: "322",
  },
  LARGER2: {
    name: "SPS LARGER 2",
    img: "https:\/\/vistar-capture.s3.cern.ch\/larger2.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LHCLUMINOSITY: {
    name: "LHC Luminosity",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhclumi.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LHCEXPMAG: {
    name: "LHC Exp Magnets",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhcexpmag.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LHCBDS: {
    name: "LHC Beam Dump",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhcbds.png",
    refreshrate: "2000",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LHCCOLLB1: {
    name: "LHC Collimator Beam 1",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhccolli1.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LHCCOLLB2: {
    name: "LHC Collimator Beam 2",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhccolli2.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LHCfExperiment: {
    name: "LHCf Experiment",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhcf.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LIN: {
    name: "Linac 3 FD",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lisis.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "21",
  },
  PEA: {
    name: "CPS EAST Area",
    img: "https:\/\/vistar-capture.s3.cern.ch\/pea.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "683",
  },
  PSB: {
    name: "PSB",
    img: "https:\/\/vistar-capture.s3.cern.ch\/psb.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "503",
  },
  LARGER4: {
    name: "SPS LARGER 4",
    img: "https:\/\/vistar-capture.s3.cern.ch\/larger4.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "424",
  },
  SPS1: {
    name: "SPS Page 1",
    img: "https:\/\/vistar-capture.s3.cern.ch\/sps1.png",
    refreshrate: "1200",
    ext_refreshrate: "7000",
    lgbk: "424",
  },
  LHCBSRT: {
    name: "LHC BSRT",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhcbsrt.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "322",
  },
  LARGER3: {
    name: "SPS LARGER 3",
    img: "https:\/\/vistar-capture.s3.cern.ch\/larger3.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "424",
  },
  ADE: {
    name: "ADE",
    img: "https:\/\/vistar-capture.s3.cern.ch\/ade.png",
    refreshrate: "1100",
    ext_refreshrate: "3000",
    lgbk: "1321",
  },
  CLEAR: {
    name: "CLEAR",
    img: "https:\/\/vistar-capture.s3.cern.ch\/cleargen.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "100",
  },
  T9_CPS_EAST: {
    name: "T9 BLFS",
    img: "https:\/\/vistar-capture.s3.cern.ch\/t9blfs.png",
    refreshrate: "03000",
    ext_refreshrate: "3000",
    lgbk: "",
  },
  LHCRFTiming: {
    name: "LHC RF Timing",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhcrftiming.png",
    refreshrate: "2000",
    ext_refreshrate: "2000",
    lgbk: "",
  },
  CPSBLM: {
    name: "CPS BLM",
    img: "https:\/\/vistar-capture.s3.cern.ch\/cpsblm.png",
    refreshrate: "500",
    ext_refreshrate: "5000",
    lgbk: "683",
  },
  Linac3: {
    name: "Linac 3",
    img: "https:\/\/vistar-capture.s3.cern.ch\/ln3.png",
    refreshrate: "1200",
    ext_refreshrate: "5000",
    lgbk: "21",
  },
  SPSBT: {
    name: "SPS BT",
    img: "https:\/\/vistar-capture.s3.cern.ch\/spsbt.png",
    refreshrate: "5000",
    ext_refreshrate: "10000",
    lgbk: "424",
  },
  PSBBLM: {
    name: "PSB BLM",
    img: "https:\/\/vistar-capture.s3.cern.ch\/psbblm.png",
    refreshrate: "1200",
    ext_refreshrate: "10000",
    lgbk: "503",
  },
  Linac4: {
    name: "Linac 4",
    img: "https:\/\/vistar-capture.s3.cern.ch\/ln4.png",
    refreshrate: "1000",
    ext_refreshrate: "1000",
    lgbk: "221",
  },
  AwakePlasma: {
    name: "Awake Plasma",
    img: "https:\/\/vistar-capture.s3.cern.ch\/awakeplasma.png",
    refreshrate: "1000",
    ext_refreshrate: "1000",
    lgbk: "",
  },
  AwakeProton: {
    name: "Awake Proton",
    img: "https:\/\/vistar-capture.s3.cern.ch\/awakeproton.png",
    refreshrate: "1000",
    ext_refreshrate: "1000",
    lgbk: "",
  },
  Awake: {
    name: "Awake",
    img: "https:\/\/vistar-capture.s3.cern.ch\/awake.png",
    refreshrate: "2000",
    ext_refreshrate: "5000",
    lgbk: "",
  },
  SPSBSRT: {
    name: "SPS BSRT",
    img: "https:\/\/vistar-capture.s3.cern.ch\/spsbsrt.png",
    refreshrate: "2000",
    ext_refreshrate: "5000",
    lgbk: "424",
  },
  LHCRomanPots: {
    name: "LHC Roman Pots",
    img: "https:\/\/vistar-capture.s3.cern.ch\/lhcromanpots.png",
    refreshrate: "2000",
    ext_refreshrate: "2000",
    lgbk: "322",
  },
  CPSSpare: {
    name: "CPS Spare",
    img: "https:\/\/vistar-capture.s3.cern.ch\/cps2.png",
    refreshrate: "2000",
    ext_refreshrate: "2000",
    lgbk: "",
  },
  SPSFastBCT: {
    name: "SPS Fast BCT",
    img: "https:\/\/vistar-capture.s3.cern.ch\/spsbctf.png",
    refreshrate: "1200",
    ext_refreshrate: "7000",
    lgbk: "424",
  },
  ELENA: {
    name: "ELENA",
    img: "https:\/\/vistar-capture.s3.cern.ch\/elena.png",
    refreshrate: "1200",
    ext_refreshrate: "5000",
    lgbk: "",
  },
  LHCATLAS: {
    name: "LHC ATLAS",
    img: "https:\/\/vistar-capture.s3.cern.ch\/atlas.png",
    refreshrate: "15000",
    ext_refreshrate: "15000",
    lgbk: "322",
  },
  PS2SPS1: {
    name: "CPS to SPS 1",
    img: "https:\/\/vistar-capture.s3.cern.ch\/ps2sps1.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "505",
  },
  PS2SPS2: {
    name: "CPS to SPS 2",
    img: "https:\/\/vistar-capture.s3.cern.ch\/ps2sps2.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "505",
  },
  ACCRTT: {
    name: "ACC RT for visitors",
    img: "https:\/\/vistar-capture.s3.cern.ch\/accpoprt.png",
    refreshrate: "1100",
    ext_refreshrate: "6000",
    lgbk: "",
  },
};

const vistars: [string, number, Vistar[]][] = [];
{
    const by_ex: {[k: string]: Vistar[]} = {};
    for (const key of Object.keys(vistarData) as Array<keyof typeof vistarData>) {
        const vistar = vistarData[key];
        const ex = vistar.name.split(" ", 2)[0]!;
        by_ex[ex] = by_ex[ex] || [];
        by_ex[ex].push({...vistar, ...{key}});
    }
    const ex_keys = Object.keys(by_ex);
    ex_keys.sort();
    for (const experiment of ex_keys) {
        const list = by_ex[experiment]!;
        list.sort((a, b) => a.name.localeCompare(b.name));
        vistars.push([experiment, 0, list]);
    }
}

export class CERN extends Cell {
  private active_ex = 9;
  private ex_colours = [randColorNr()];
  private divider_colours = [randColorNr(), randColorNr(), randColorNr(), randColorNr(), randColorNr(), randColorNr(), randColorNr()];
  private vistars_colours;

  private image_load_t: number | undefined;
  private active_img: HTMLImageElement | undefined;

  constructor(input: CellInput) {
    super(input);
    vistars[this.active_ex]![1] = 12;
    for (let i = 0; i < vistars.length; i++) {
        this.ex_colours.push(randColorNr());
    }
    const m = vistars.map(v => v[2].length).reduce((a, b) => Math.max(a, b));
    const vistars_colours = [];
    for (let i = 0; i < m; i++) {
        vistars_colours.push(randColorNr());
    }
    this.vistars_colours = vistars_colours;
    this.load_image();
    this.set_load_image();
  }

  private set_load_image() {
    clearTimeout(this.image_load_t);
    const active_ex = vistars[this.active_ex]!;
    const r = active_ex[2][active_ex[1]]!.refreshrate;
    this.image_load_t = setTimeout(() => {
        this.load_image();
        this.set_load_image();
    }, parseInt(r));
  }

  private load_image() {
    const img = new Image;
    img.onload = () => {
        this.active_img = img;
    };
    const active_ex = vistars[this.active_ex]!;
    let src = active_ex[2][active_ex[1]]!.img + '?' + Math.random();
    src = src.replace("https://vistar-capture.s3.cern.ch/", "/api/vistars/");    
    img.src = src;
  }

  frame() {
    let current_x = this.x;
    let current_y = this.y;

    // experiment list
    for (let i = 0; i < vistars.length; i++) {
        context.fillStyle = i == this.active_ex ? 'white' : getColor(this.ex_colours[i]!);
        context.fillRect(current_x, current_y, unit_width, unit_height);

        const t = vistars[i]![0].toUpperCase();
        context.font = "700 20px Antonio,Inter,Avenir,Helvetica,Arial,sans-serif";
        const m = context.measureText(t);
        context.fillStyle = 'black';
        context.fillText(t, current_x + unit_width - m.width - 12, current_y + unit_height - 6);

        current_y += unit_height + unit_gap;
    }
    if (current_y < this.y + this.h) {
        context.fillStyle = getColor(this.ex_colours[this.ex_colours.length - 1]!);
        context.fillRect(current_x, current_y, unit_width, this.y + this.h - current_y);
    }
    current_x += unit_width + unit_gap;
    current_y = this.y;

    // buttons
    for (let i = 0; i < vistars[this.active_ex]![2].length; i++) {
        const vistar = vistars[this.active_ex]![2][i]!;
        context.fillStyle = i == vistars[this.active_ex]![1] ? 'white' : getColor(this.vistars_colours[i]!);
        context.fillRect(current_x, current_y, unit_width, unit_height);

        let t = vistar.name.replace(vistars[this.active_ex]![0], "").trim();
        if (!t) {
            t = vistar.name;
        }
        context.font = "700 20px Antonio,Inter,Avenir,Helvetica,Arial,sans-serif";
        const m = context.measureText(t);
        context.fillStyle = 'black';
        context.fillText(t, current_x + unit_width - m.width - 12, current_y + unit_height - 6);

        current_x += unit_width + unit_gap;
        if (current_x + unit_width + unit_gap > this.x + this.w) {
            current_x = this.x + unit_width + unit_gap;
            current_y += unit_height + unit_gap;
        }
    }
    current_y += unit_height + unit_gap;
    current_x = this.x + unit_width + unit_gap;

    // bar
    {
        const bar_height = 30;
        context.fillStyle = getColor(this.divider_colours[0]!);
        context.beginPath();
        context.moveTo(current_x + bar_height + 10, current_y);
        context.lineTo(current_x + bar_height, current_y);
        context.arcTo (current_x, current_y,
                       current_x, current_y + bar_height / 2,
                       bar_height / 2);
        context.arcTo (current_x, current_y + bar_height,
                       current_x + bar_height, current_y + bar_height,
                       bar_height / 2);
        context.lineTo(current_x + bar_height + 10, current_y + bar_height);
        context.closePath();
        context.fill();
        current_x += bar_height + 10 + unit_gap;

        context.fillStyle = getColor(this.divider_colours[1]!);
        context.fillRect(current_x, current_y, 80, bar_height);
        context.font = "18px Antonio,Inter,Avenir,Helvetica,Arial,sans-serif";
        {
            const active_ex = vistars[this.active_ex]!;
            const active_v = active_ex[2][active_ex[1]]!;
            const t = `${this.active_ex}-${active_ex[1]}`;
            const m = context.measureText(t);
            context.fillStyle = 'black';
            context.fillText(t, current_x + 80 - m.width - 12, current_y + bar_height - 8);
        }
        current_x += 80 + unit_gap;
        context.fillStyle = getColor(this.divider_colours[2]!);
        context.font = "18px Antonio,Inter,Avenir,Helvetica,Arial,sans-serif";
        {
            const active_ex = vistars[this.active_ex]!;
            const active_v = active_ex[2][active_ex[1]]!;
            const t = active_v.key;
            const m = context.measureText(t);
            const w = Math.max(m.width + 12 + 12, 80);
            context.fillRect(current_x, current_y, w, bar_height);
            context.fillStyle = 'black';
            context.fillText(t, current_x + w - m.width - 12, current_y + bar_height - 8);
            current_x += w + unit_gap;
        }
        context.fillStyle = getColor(this.divider_colours[3]!);
        context.fillRect(current_x, current_y, 80, bar_height);
        context.font = "18px Antonio,Inter,Avenir,Helvetica,Arial,sans-serif";
        {
            const active_ex = vistars[this.active_ex]!;
            const active_v = active_ex[2][active_ex[1]]!;
            const t = active_v.lgbk;
            const m = context.measureText(t);
            context.fillStyle = 'black';
            context.fillText(t, current_x + 80 - m.width - 12, current_y + bar_height - 8);
        }
        current_x += 80 + unit_gap;
        context.fillStyle = getColor(this.divider_colours[4]!);
        context.fillRect(current_x, current_y, 80, bar_height);
        context.font = "18px Antonio,Inter,Avenir,Helvetica,Arial,sans-serif";
        {
            const active_ex = vistars[this.active_ex]!;
            const active_v = active_ex[2][active_ex[1]]!;
            const t = active_v.refreshrate;
            const m = context.measureText(t);
            context.fillStyle = 'black';
            context.fillText(t, current_x + 80 - m.width - 12, current_y + bar_height - 8);
        }
        current_x += 80 + unit_gap;
        context.fillStyle = getColor(this.divider_colours[5]!);
        context.fillRect(current_x, current_y, this.x + this.w - unit_gap * 2 - bar_height - 10 - current_x, bar_height);
        current_x = this.x + this.w - unit_gap - bar_height - 10;

        context.fillStyle = getColor(this.divider_colours[6]!);
        context.beginPath();
        context.moveTo(current_x, current_y);
        context.lineTo(current_x + 10, current_y);
        context.arcTo (current_x + 10 + bar_height, current_y,
                       current_x + 10 + bar_height, current_y + bar_height / 2,
                       bar_height / 2);
        context.arcTo (current_x + 10 + bar_height, current_y + bar_height,
                       current_x + 10, current_y + bar_height,
                       bar_height / 2);
        context.lineTo(current_x, current_y + bar_height);
        context.closePath();
        context.fill();
        current_x = this.x + unit_width + unit_gap;
        current_y += bar_height + unit_gap;
    }

    // image
    if (this.active_img) {
        let img_width = Math.min(this.x + this.w - current_x - unit_gap, this.active_img.naturalWidth);
        let img_height = Math.min(this.y + this.h - current_y - unit_gap, this.active_img.naturalHeight);
        let ratio_w = img_width / this.active_img.naturalWidth;
        let ratio_h = img_height / this.active_img.naturalHeight;
        let ratio = Math.min(ratio_w, ratio_h);
        img_width = this.active_img.naturalWidth * ratio;
        img_height = this.active_img.naturalHeight * ratio;
        const w = (this.x + this.w - current_x - img_width) / 2;
        const h = (this.y + this.h - current_y - img_height) / 2;
        context.drawImage(this.active_img, current_x + w, current_y + h, img_width, img_height);
    }
  }

  click(rootx: number, rooty: number): boolean {
    const x = rootx - this.x;
    const y = rooty - this.y;
    if (x < 0 || x > this.w || y < 0 || y > this.h) {
        return false
    }
    if (x < unit_width) {
        const i = Math.floor(y / (unit_height + unit_gap));
        if (i < vistars.length) {
            this.active_ex = i;
            this.active_img = undefined;
            this.load_image();
            this.set_load_image();
            playOnce('blip');
            return true;
        }
    } else {
        let ex_vistars = vistars[this.active_ex]![2];
        let current_x = unit_width + unit_gap;
        let current_y = 0;
        for (let i = 0; i < ex_vistars.length; i++) {
            if (x > current_x && x < current_x + unit_width && y > current_y && y < current_y + unit_height) {
                if (i != vistars[this.active_ex]![1]) {
                    vistars[this.active_ex]![1] = i;
                    this.active_img = undefined;
                    this.load_image();
                    this.set_load_image();
                }
                playOnce('blip');
                return true;
            }
            current_x += unit_width + unit_gap;
            if (current_x + unit_width + unit_gap > this.w) {
                current_x = unit_width + unit_gap;
                current_y += unit_height + unit_gap;
            }
        }
    }
    return false;
  }
}
