DELIMITER $$
CREATE PROCEDURE `proc_build_tct`(property_iri VARCHAR(150))
BEGIN
    SELECT @lvl := 0;

    SELECT @property_id := id
    FROM concept
    WHERE iri = property_iri;

    DELETE FROM concept_tct
    WHERE property = @property_id;

    -- Insert LOWEST level (i.e. concepts without children)
    INSERT INTO concept_tct
    (source, property, target, level)
    SELECT o.id, @property_id, o.value, 0
    FROM concept_property_object o
             LEFT JOIN concept_property_object p ON p.value = o.id AND p.property = @property_id
    WHERE o.property = @property_id
      AND p.id IS NULL;

    SELECT @inserted := ROW_COUNT();

    WHILE @inserted > 0 DO
            SELECT @lvl := @lvl + 1;

            -- Insert parents of last tct entries
            REPLACE INTO concept_tct
            (source, property, target, level)
            SELECT DISTINCT h.id, @property_id, h.value, @lvl
            FROM concept_property_object h
                     JOIN concept_tct t ON h.id = t.target AND t.level = @lvl - 1 AND t.property = @property_id
            WHERE h.property = @property_id;

            -- Inherit relationships
            REPLACE INTO concept_tct
            (source, property, target, level)
            SELECT DISTINCT t.source, @property_id, p.target, @lvl
            FROM concept_tct t
                     JOIN concept_tct p ON p.source = t.target
            WHERE t.level = @lvl-1;

            SELECT @inserted := ROW_COUNT();
        END WHILE;
END$$
DELIMITER ;

-- CALL proc_build_tct('sn:SN_116680003');
