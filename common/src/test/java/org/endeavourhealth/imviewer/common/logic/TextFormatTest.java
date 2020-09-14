package org.endeavourhealth.imviewer.common.logic;

import org.endeavourhealth.common.config.ConfigManager;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class TextFormatTest {
    private TextFormat logic;

    @Before
    public void setUp() throws Exception {
        ConfigManager.Initialize("information-manager");
        logic = new TextFormat();
    }

    @Test
    public void get() throws Exception {
        String actual = logic.get(":DM_AandEEncounterEntry");
        Assert.assertEquals("", actual);
    }
}
