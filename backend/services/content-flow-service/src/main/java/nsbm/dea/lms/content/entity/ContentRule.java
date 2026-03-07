package nsbm.dea.lms.content.entity;

import jakarta.persistence.*;
import lombok.*;
import nsbm.dea.lms.content.entity.enums.RuleType;

import java.util.UUID;

@Entity
@Table(name = "content_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @Column(nullable = false, columnDefinition = "CHAR(36)")
    private UUID contentItemId;

    @Column(nullable = false, columnDefinition = "CHAR(36)")
    private UUID requiredCompletionOf;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleType ruleType;
}