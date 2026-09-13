package com.seal.hackathon.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Bo tieu chi mau, dung lai duoc giua nhieu su kien. */
@Getter
@Setter
@Entity
@Table(name = "criteria_template")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriteriaTemplate extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    /** Bo mac dinh duoc goi y san khi tao vong thi moi. */
    @Column(nullable = false)
    private boolean isDefault;
}
