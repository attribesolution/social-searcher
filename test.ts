interface SMP {
    search();
}

class Youtube implements SMP {
    search() {
        console.log('In YOUTUBE`')
    }
}


class Twitter implements SMP {
    search() {
        console.log('In TWITTER`')
    }
}

class Merge {
    private smp: SMP
    constructor() {
        this.smp = new Twitter()
    }
}