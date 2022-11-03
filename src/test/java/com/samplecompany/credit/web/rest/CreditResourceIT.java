package com.samplecompany.credit.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.samplecompany.credit.IntegrationTest;
import com.samplecompany.credit.domain.Credit;
import com.samplecompany.credit.repository.CreditRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CreditResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CreditResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_ACTIVE = false;
    private static final Boolean UPDATED_IS_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/credits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCreditMockMvc;

    private Credit credit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Credit createEntity(EntityManager em) {
        Credit credit = new Credit().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION).isActive(DEFAULT_IS_ACTIVE);
        return credit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Credit createUpdatedEntity(EntityManager em) {
        Credit credit = new Credit().name(UPDATED_NAME).description(UPDATED_DESCRIPTION).isActive(UPDATED_IS_ACTIVE);
        return credit;
    }

    @BeforeEach
    public void initTest() {
        credit = createEntity(em);
    }

    @Test
    @Transactional
    void createCredit() throws Exception {
        int databaseSizeBeforeCreate = creditRepository.findAll().size();
        // Create the Credit
        restCreditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(credit)))
            .andExpect(status().isCreated());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeCreate + 1);
        Credit testCredit = creditList.get(creditList.size() - 1);
        assertThat(testCredit.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCredit.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCredit.getIsActive()).isEqualTo(DEFAULT_IS_ACTIVE);
    }

    @Test
    @Transactional
    void createCreditWithExistingId() throws Exception {
        // Create the Credit with an existing ID
        credit.setId(1L);

        int databaseSizeBeforeCreate = creditRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCreditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(credit)))
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCredits() throws Exception {
        // Initialize the database
        creditRepository.saveAndFlush(credit);

        // Get all the creditList
        restCreditMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(credit.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    void getCredit() throws Exception {
        // Initialize the database
        creditRepository.saveAndFlush(credit);

        // Get the credit
        restCreditMockMvc
            .perform(get(ENTITY_API_URL_ID, credit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(credit.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingCredit() throws Exception {
        // Get the credit
        restCreditMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCredit() throws Exception {
        // Initialize the database
        creditRepository.saveAndFlush(credit);

        int databaseSizeBeforeUpdate = creditRepository.findAll().size();

        // Update the credit
        Credit updatedCredit = creditRepository.findById(credit.getId()).get();
        // Disconnect from session so that the updates on updatedCredit are not directly saved in db
        em.detach(updatedCredit);
        updatedCredit.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).isActive(UPDATED_IS_ACTIVE);

        restCreditMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCredit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCredit))
            )
            .andExpect(status().isOk());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
        Credit testCredit = creditList.get(creditList.size() - 1);
        assertThat(testCredit.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCredit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCredit.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void putNonExistingCredit() throws Exception {
        int databaseSizeBeforeUpdate = creditRepository.findAll().size();
        credit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(
                put(ENTITY_API_URL_ID, credit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(credit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCredit() throws Exception {
        int databaseSizeBeforeUpdate = creditRepository.findAll().size();
        credit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(credit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCredit() throws Exception {
        int databaseSizeBeforeUpdate = creditRepository.findAll().size();
        credit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(credit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCreditWithPatch() throws Exception {
        // Initialize the database
        creditRepository.saveAndFlush(credit);

        int databaseSizeBeforeUpdate = creditRepository.findAll().size();

        // Update the credit using partial update
        Credit partialUpdatedCredit = new Credit();
        partialUpdatedCredit.setId(credit.getId());

        partialUpdatedCredit.description(UPDATED_DESCRIPTION).isActive(UPDATED_IS_ACTIVE);

        restCreditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCredit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCredit))
            )
            .andExpect(status().isOk());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
        Credit testCredit = creditList.get(creditList.size() - 1);
        assertThat(testCredit.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCredit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCredit.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void fullUpdateCreditWithPatch() throws Exception {
        // Initialize the database
        creditRepository.saveAndFlush(credit);

        int databaseSizeBeforeUpdate = creditRepository.findAll().size();

        // Update the credit using partial update
        Credit partialUpdatedCredit = new Credit();
        partialUpdatedCredit.setId(credit.getId());

        partialUpdatedCredit.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).isActive(UPDATED_IS_ACTIVE);

        restCreditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCredit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCredit))
            )
            .andExpect(status().isOk());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
        Credit testCredit = creditList.get(creditList.size() - 1);
        assertThat(testCredit.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCredit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCredit.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void patchNonExistingCredit() throws Exception {
        int databaseSizeBeforeUpdate = creditRepository.findAll().size();
        credit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, credit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(credit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCredit() throws Exception {
        int databaseSizeBeforeUpdate = creditRepository.findAll().size();
        credit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(credit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCredit() throws Exception {
        int databaseSizeBeforeUpdate = creditRepository.findAll().size();
        credit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(credit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Credit in the database
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCredit() throws Exception {
        // Initialize the database
        creditRepository.saveAndFlush(credit);

        int databaseSizeBeforeDelete = creditRepository.findAll().size();

        // Delete the credit
        restCreditMockMvc
            .perform(delete(ENTITY_API_URL_ID, credit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Credit> creditList = creditRepository.findAll();
        assertThat(creditList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
