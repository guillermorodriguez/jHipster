package com.samplecompany.credit.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.samplecompany.credit.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OfferingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Offering.class);
        Offering offering1 = new Offering();
        offering1.setId(1L);
        Offering offering2 = new Offering();
        offering2.setId(offering1.getId());
        assertThat(offering1).isEqualTo(offering2);
        offering2.setId(2L);
        assertThat(offering1).isNotEqualTo(offering2);
        offering1.setId(null);
        assertThat(offering1).isNotEqualTo(offering2);
    }
}
