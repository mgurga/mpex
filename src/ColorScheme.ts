const max_schemes: number = 3; // + 1 (includes 0)

export class ColorScheme {
    private scheme: number;

    bg: string; // background
    fg: string; // foreground
    ab: string; // accent 1 (bright)
    am: string; // accent 2 (mild)
    ad: string; // accent 3 (dark)

    constructor(s?: number) {
        if (s == null) {
            this.scheme = Math.floor(Math.random() * max_schemes);
        } else {
            if (s >= 0 && s <= max_schemes) {
                this.scheme = s;
                console.log(`using color scheme #${this.scheme}`);
            } else {
                this.scheme = 0;
                console.error(`color scheme #${s} out of range, using scheme 0`);
            }
        }

        this.set_scheme(this.scheme);
    }

    get_scheme(): number { return this.scheme; }

    set_scheme(s: number): void {
        this.scheme = s;

        switch (this.scheme) {
            case 0:
                this.bg = "#FCFCFC";
                this.fg = "#F4E04D";
                this.ab = "#54F2F2";
                this.am = "#5EB1BF";
                this.ad = "#042A2B";
                break;
            case 1:
                this.bg = "#F5ECCD";
                this.fg = "#FF47DA";
                this.ab = "#FCC8C2";
                this.am = "#FF87AB";
                this.ad = "#1B065E";
                break;
            case 2:
                this.bg = "#E6FAFC";
                this.fg = "#353D2F";
                this.ab = "#9CFC97";
                this.am = "#6BA368";
                this.ad = "#172216";
                break;
            case 3:
                this.bg = "#FFEAAE";
                this.fg = "#0A0903";
                this.ab = "#FFC100";
                this.am = "#FF8200";
                this.ad = "#FF0000";
                break;
        }
    }
}