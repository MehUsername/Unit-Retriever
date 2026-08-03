const spawnEffect = new Effect(50, 500, e => {
    e.lifetime = e.rotation;

    // Draw.color(Pal.heal);
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
        let unitsRetrieved = 0;
        let enemiesRetrieved = 0;

        Groups.unit.each(u => {
            if (Double.isNaN(u.x) || Double.isNaN(u.y)) {
                let team = u.team;
                let spawnPoint = Vars.spawner.getFirstSpawn();
                let isSpawner = spawnPoint !== null;
                let isPlayerTeam = team === Vars.player.team();

                if ((spawnPoint === null) || isPlayerTeam) {
                    spawnPoint = Vars.state.teams.get(team).core();
                    isSpawner = false;
                }

                u.remove();
                if (spawnPoint) { // units are removed when theres nothing to spawn them at
                    let spawnX = (isSpawner) ? spawnPoint.worldx() : spawnPoint.x;
                    let spawnY = (isSpawner) ? spawnPoint.worldy() : spawnPoint.y;

                    Time.run(5, () => {
                        UnitTypes[u.type].spawn(team, spawnX, spawnY);
                        spawnEffect.at(spawnX, spawnY, 100, team.color);
                    })

                    if (isPlayerTeam) {
                        unitsRetrieved++;
                    } else {
                        enemiesRetrieved++;
                    }
                }
            }
        })
        Vars.ui.hudfrag.showToast(Icon.units, 
            (unitsRetrieved <= 0 && enemiesRetrieved <= 0) ? 
            "[yellow]Every unit is here!" :
            "[green]Units retrieved: []" + unitsRetrieved + "\n[red]Enemies retrieved: []" + enemiesRetrieved
        );
    })

    t.setFillParent(true);
    t.align(Align.bottomLeft);
    t.top().left();
    t.add(b).size(60, 60);

    t.pack();

    let uiTopLeft = Vars.ui.hudGroup.find("overlaymarker").find("waves/editor").find("waves");

    t.marginTop(uiTopLeft.getPrefHeight());
    t.marginLeft(-4);

    uiTopLeft.update(() => {
        if (t.getMarginTop() == uiTopLeft.getPrefHeight()) return;

        t.marginTop(uiTopLeft.getPrefHeight());
        t.pack();
    })

    hudGroup.addChild(t);
}));