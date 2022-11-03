package com.samplecompany.credit.repository;

import com.samplecompany.credit.domain.Offering;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Offering entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OfferingRepository extends JpaRepository<Offering, Long> {}
