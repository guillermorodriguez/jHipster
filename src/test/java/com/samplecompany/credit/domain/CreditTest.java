package com.samplecompany.credit.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.samplecompany.credit.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CreditTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Credit.class);
        Credit credit1 = new Credit();
        credit1.setId(1L);
        Credit credit2 = new Credit();
        credit2.setId(credit1.getId());
        assertThat(credit1).isEqualTo(credit2);
        credit2.setId(2L);
        assertThat(credit1).isNotEqualTo(credit2);
        credit1.setId(null);
        assertThat(credit1).isNotEqualTo(credit2);
    }
}
