package com.samplecompany.credit.web.rest;

import com.samplecompany.credit.domain.Credit;
import com.samplecompany.credit.repository.CreditRepository;
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
 * REST controller for managing {@link com.samplecompany.credit.domain.Credit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CreditResource {

    private final Logger log = LoggerFactory.getLogger(CreditResource.class);

    private static final String ENTITY_NAME = "credit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CreditRepository creditRepository;

    public CreditResource(CreditRepository creditRepository) {
        this.creditRepository = creditRepository;
    }

    /**
     * {@code POST  /credits} : Create a new credit.
     *
     * @param credit the credit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new credit, or with status {@code 400 (Bad Request)} if the credit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/credits")
    public ResponseEntity<Credit> createCredit(@RequestBody Credit credit) throws URISyntaxException {
        log.debug("REST request to save Credit : {}", credit);
        if (credit.getId() != null) {
            throw new BadRequestAlertException("A new credit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Credit result = creditRepository.save(credit);
        return ResponseEntity
            .created(new URI("/api/credits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /credits/:id} : Updates an existing credit.
     *
     * @param id the id of the credit to save.
     * @param credit the credit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated credit,
     * or with status {@code 400 (Bad Request)} if the credit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the credit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/credits/{id}")
    public ResponseEntity<Credit> updateCredit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Credit credit)
        throws URISyntaxException {
        log.debug("REST request to update Credit : {}, {}", id, credit);
        if (credit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, credit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!creditRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Credit result = creditRepository.save(credit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, credit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /credits/:id} : Partial updates given fields of an existing credit, field will ignore if it is null
     *
     * @param id the id of the credit to save.
     * @param credit the credit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated credit,
     * or with status {@code 400 (Bad Request)} if the credit is not valid,
     * or with status {@code 404 (Not Found)} if the credit is not found,
     * or with status {@code 500 (Internal Server Error)} if the credit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/credits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Credit> partialUpdateCredit(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Credit credit
    ) throws URISyntaxException {
        log.debug("REST request to partial update Credit partially : {}, {}", id, credit);
        if (credit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, credit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!creditRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Credit> result = creditRepository
            .findById(credit.getId())
            .map(existingCredit -> {
                if (credit.getName() != null) {
                    existingCredit.setName(credit.getName());
                }
                if (credit.getDescription() != null) {
                    existingCredit.setDescription(credit.getDescription());
                }
                if (credit.getIsActive() != null) {
                    existingCredit.setIsActive(credit.getIsActive());
                }

                return existingCredit;
            })
            .map(creditRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, credit.getId().toString())
        );
    }

    /**
     * {@code GET  /credits} : get all the credits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of credits in body.
     */
    @GetMapping("/credits")
    public List<Credit> getAllCredits() {
        log.debug("REST request to get all Credits");
        return creditRepository.findAll();
    }

    /**
     * {@code GET  /credits/:id} : get the "id" credit.
     *
     * @param id the id of the credit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the credit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/credits/{id}")
    public ResponseEntity<Credit> getCredit(@PathVariable Long id) {
        log.debug("REST request to get Credit : {}", id);
        Optional<Credit> credit = creditRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(credit);
    }

    /**
     * {@code DELETE  /credits/:id} : delete the "id" credit.
     *
     * @param id the id of the credit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/credits/{id}")
    public ResponseEntity<Void> deleteCredit(@PathVariable Long id) {
        log.debug("REST request to delete Credit : {}", id);
        creditRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
