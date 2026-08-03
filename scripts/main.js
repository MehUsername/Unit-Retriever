const spawnEffect = new Effect(120, 500, e => {
    e.lifetime = e.rotation;

    Draw.color(Pal.heal);
    Lines.stroke(e.fout(Interp.pow5Out) * 4);
    Lines.circle(e.x, e.y, e.fin() * e.rotation * 2);
});

Events.on(ClientLoadEvent, cons(e => {
    // Access the game's core UI
    let hudGroup = Vars.ui.hudGroup;

    let t = new Table(Styles.none);
    t.name = "unit-retriever-t";

    let b = new ImageButton(Icon.units, Styles.nodei);
    b.name = "unit-retriever-btn";

    let bStyle = b.getStyle();
    bStyle.up = Tex.buttonRight;
    bStyle.down = Tex.buttonRightDown;
    bStyle.over = Tex.buttonRightOver;

    b.clicked(() => {
        if (!Vars.state.isGame()) return;
        // Action to perform when the button is clicked
        let unitsRetrieved = 0;
        let p = Vars.player;
        let core = Vars.state.teams.get(p.team()).core()

        let offset = (Math.random() * 8) - 4;

        Groups.unit.each(u => {
            if (Double.isNaN(u.x) || Double.isNaN(u.y)) {
                u.remove();
                Time.run(5, () => {
                    UnitTypes[u.type].spawn(p.team(), core.x + offset, core.y + offset);
                })

                unitsRetrieved++;
            }
        })

        if (unitsRetrieved > 0) {
            spawnEffect.at(core.x, core.y, 100);
        }
        Vars.ui.hudfrag.showToast(Icon.units, (unitsRetrieved > 0) ? "Retreived " + unitsRetrieved + " unit" + ((unitsRetrieved > 1) ? "s" : "") + "!" : "All units are here!");
    })

    t.setFillParent(true);
    t.align(Align.topLeft);
    t.top().left();
    t.add(b).size(60, 60);

    t.pack();
    t.marginTop(Scl.scl(84));
    t.marginLeft(Scl.scl(-4))

    // Add the table to the HUD
    hudGroup.addChild(t)
}));

