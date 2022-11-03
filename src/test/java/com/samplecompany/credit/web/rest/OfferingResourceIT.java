package com.samplecompany.credit.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.samplecompany.credit.IntegrationTest;
import com.samplecompany.credit.domain.Offering;
import com.samplecompany.credit.repository.OfferingRepository;
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
 * Integration tests for the {@link OfferingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OfferingResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_RATE = 1D;
    private static final Double UPDATED_RATE = 2D;

    private static final Integer DEFAULT_START_YEAR = 1;
    private static final Integer UPDATED_START_YEAR = 2;

    private static final String ENTITY_API_URL = "/api/offerings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OfferingRepository offeringRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOfferingMockMvc;

    private Offering offering;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Offering createEntity(EntityManager em) {
        Offering offering = new Offering().name(DEFAULT_NAME).rate(DEFAULT_RATE).startYear(DEFAULT_START_YEAR);
        return offering;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Offering createUpdatedEntity(EntityManager em) {
        Offering offering = new Offering().name(UPDATED_NAME).rate(UPDATED_RATE).startYear(UPDATED_START_YEAR);
        return offering;
    }

    @BeforeEach
    public void initTest() {
        offering = createEntity(em);
    }

    @Test
    @Transactional
    void createOffering() throws Exception {
        int databaseSizeBeforeCreate = offeringRepository.findAll().size();
        // Create the Offering
        restOfferingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offering)))
            .andExpect(status().isCreated());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeCreate + 1);
        Offering testOffering = offeringList.get(offeringList.size() - 1);
        assertThat(testOffering.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testOffering.getRate()).isEqualTo(DEFAULT_RATE);
        assertThat(testOffering.getStartYear()).isEqualTo(DEFAULT_START_YEAR);
    }

    @Test
    @Transactional
    void createOfferingWithExistingId() throws Exception {
        // Create the Offering with an existing ID
        offering.setId(1L);

        int databaseSizeBeforeCreate = offeringRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOfferingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offering)))
            .andExpect(status().isBadRequest());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOfferings() throws Exception {
        // Initialize the database
        offeringRepository.saveAndFlush(offering);

        // Get all the offeringList
        restOfferingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offering.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].rate").value(hasItem(DEFAULT_RATE.doubleValue())))
            .andExpect(jsonPath("$.[*].startYear").value(hasItem(DEFAULT_START_YEAR)));
    }

    @Test
    @Transactional
    void getOffering() throws Exception {
        // Initialize the database
        offeringRepository.saveAndFlush(offering);

        // Get the offering
        restOfferingMockMvc
            .perform(get(ENTITY_API_URL_ID, offering.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offering.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.rate").value(DEFAULT_RATE.doubleValue()))
            .andExpect(jsonPath("$.startYear").value(DEFAULT_START_YEAR));
    }

    @Test
    @Transactional
    void getNonExistingOffering() throws Exception {
        // Get the offering
        restOfferingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOffering() throws Exception {
        // Initialize the database
        offeringRepository.saveAndFlush(offering);

        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();

        // Update the offering
        Offering updatedOffering = offeringRepository.findById(offering.getId()).get();
        // Disconnect from session so that the updates on updatedOffering are not directly saved in db
        em.detach(updatedOffering);
        updatedOffering.name(UPDATED_NAME).rate(UPDATED_RATE).startYear(UPDATED_START_YEAR);

        restOfferingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOffering.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOffering))
            )
            .andExpect(status().isOk());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
        Offering testOffering = offeringList.get(offeringList.size() - 1);
        assertThat(testOffering.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOffering.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testOffering.getStartYear()).isEqualTo(UPDATED_START_YEAR);
    }

    @Test
    @Transactional
    void putNonExistingOffering() throws Exception {
        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();
        offering.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfferingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offering.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offering))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOffering() throws Exception {
        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();
        offering.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offering))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOffering() throws Exception {
        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();
        offering.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offering)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOfferingWithPatch() throws Exception {
        // Initialize the database
        offeringRepository.saveAndFlush(offering);

        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();

        // Update the offering using partial update
        Offering partialUpdatedOffering = new Offering();
        partialUpdatedOffering.setId(offering.getId());

        restOfferingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffering.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffering))
            )
            .andExpect(status().isOk());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
        Offering testOffering = offeringList.get(offeringList.size() - 1);
        assertThat(testOffering.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testOffering.getRate()).isEqualTo(DEFAULT_RATE);
        assertThat(testOffering.getStartYear()).isEqualTo(DEFAULT_START_YEAR);
    }

    @Test
    @Transactional
    void fullUpdateOfferingWithPatch() throws Exception {
        // Initialize the database
        offeringRepository.saveAndFlush(offering);

        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();

        // Update the offering using partial update
        Offering partialUpdatedOffering = new Offering();
        partialUpdatedOffering.setId(offering.getId());

        partialUpdatedOffering.name(UPDATED_NAME).rate(UPDATED_RATE).startYear(UPDATED_START_YEAR);

        restOfferingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffering.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffering))
            )
            .andExpect(status().isOk());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
        Offering testOffering = offeringList.get(offeringList.size() - 1);
        assertThat(testOffering.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOffering.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testOffering.getStartYear()).isEqualTo(UPDATED_START_YEAR);
    }

    @Test
    @Transactional
    void patchNonExistingOffering() throws Exception {
        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();
        offering.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfferingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offering.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offering))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOffering() throws Exception {
        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();
        offering.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offering))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOffering() throws Exception {
        int databaseSizeBeforeUpdate = offeringRepository.findAll().size();
        offering.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferingMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(offering)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Offering in the database
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOffering() throws Exception {
        // Initialize the database
        offeringRepository.saveAndFlush(offering);

        int databaseSizeBeforeDelete = offeringRepository.findAll().size();

        // Delete the offering
        restOfferingMockMvc
            .perform(delete(ENTITY_API_URL_ID, offering.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Offering> offeringList = offeringRepository.findAll();
        assertThat(offeringList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
