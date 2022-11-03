package com.samplecompany.credit.web.rest;

import com.samplecompany.credit.domain.Offering;
import com.samplecompany.credit.repository.OfferingRepository;
import com.samplecompany.credit.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.samplecompany.credit.domain.Offering}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OfferingResource {

    private final Logger log = LoggerFactory.getLogger(OfferingResource.class);

    private static final String ENTITY_NAME = "offering";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OfferingRepository offeringRepository;

    public OfferingResource(OfferingRepository offeringRepository) {
        this.offeringRepository = offeringRepository;
    }

    /**
     * {@code POST  /offerings} : Create a new offering.
     *
     * @param offering the offering to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offering, or with status {@code 400 (Bad Request)} if the offering has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/offerings")
    public ResponseEntity<Offering> createOffering(@RequestBody Offering offering) throws URISyntaxException {
        log.debug("REST request to save Offering : {}", offering);
        if (offering.getId() != null) {
            throw new BadRequestAlertException("A new offering cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Offering result = offeringRepository.save(offering);
        return ResponseEntity
            .created(new URI("/api/offerings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /offerings/:id} : Updates an existing offering.
     *
     * @param id the id of the offering to save.
     * @param offering the offering to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offering,
     * or with status {@code 400 (Bad Request)} if the offering is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offering couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/offerings/{id}")
    public ResponseEntity<Offering> updateOffering(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Offering offering
    ) throws URISyntaxException {
        log.debug("REST request to update Offering : {}, {}", id, offering);
        if (offering.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offering.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offeringRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Offering result = offeringRepository.save(offering);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offering.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /offerings/:id} : Partial updates given fields of an existing offering, field will ignore if it is null
     *
     * @param id the id of the offering to save.
     * @param offering the offering to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offering,
     * or with status {@code 400 (Bad Request)} if the offering is not valid,
     * or with status {@code 404 (Not Found)} if the offering is not found,
     * or with status {@code 500 (Internal Server Error)} if the offering couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/offerings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Offering> partialUpdateOffering(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Offering offering
    ) throws URISyntaxException {
        log.debug("REST request to partial update Offering partially : {}, {}", id, offering);
        if (offering.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offering.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offeringRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Offering> result = offeringRepository
            .findById(offering.getId())
            .map(existingOffering -> {
                if (offering.getName() != null) {
                    existingOffering.setName(offering.getName());
                }
                if (offering.getRate() != null) {
                    existingOffering.setRate(offering.getRate());
                }
                if (offering.getStartYear() != null) {
                    existingOffering.setStartYear(offering.getStartYear());
                }

                return existingOffering;
            })
            .map(offeringRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offering.getId().toString())
        );
    }

    /**
     * {@code GET  /offerings} : get all the offerings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offerings in body.
     */
    @GetMapping("/offerings")
    public List<Offering> getAllOfferings() {
        log.debug("REST request to get all Offerings");
        return offeringRepository.findAll();
    }

    /**
     * {@code GET  /offerings/:id} : get the "id" offering.
     *
     * @param id the id of the offering to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offering, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/offerings/{id}")
    public ResponseEntity<Offering> getOffering(@PathVariable Long id) {
        log.debug("REST request to get Offering : {}", id);
        Optional<Offering> offering = offeringRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(offering);
    }

    /**
     * {@code DELETE  /offerings/:id} : delete the "id" offering.
     *
     * @param id the id of the offering to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/offerings/{id}")
    public ResponseEntity<Void> deleteOffering(@PathVariable Long id) {
        log.debug("REST request to delete Offering : {}", id);
        offeringRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
