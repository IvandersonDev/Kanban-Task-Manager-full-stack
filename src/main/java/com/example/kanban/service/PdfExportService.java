package com.example.kanban.service;

import com.example.kanban.dto.TaskResponse;
import com.example.kanban.model.TaskPriority;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.model.UserAccount;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class PdfExportService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy")
        .withLocale(new Locale("pt", "BR"));
    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
        .withLocale(new Locale("pt", "BR"));

    public byte[] exportTasks(UserAccount user, List<TaskResponse> tasks) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 54, 54);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Kanban de Tarefas", titleFont));
            document.add(new Paragraph("Usuario: " + user.getFullName(), subtitleFont));
            document.add(new Paragraph("Gerado em: " + DATE_TIME_FORMAT.format(Instant.now().atZone(ZoneId.systemDefault())), subtitleFont));
            document.add(new Paragraph(" "));

            if (tasks.isEmpty()) {
                document.add(new Paragraph("Nenhuma tarefa encontrada."));
            } else {
                for (TaskStatus status : TaskStatus.values()) {
                    List<TaskResponse> statusTasks = tasks.stream()
                        .filter(task -> task.status() == status)
                        .sorted(Comparator.comparing(TaskResponse::position))
                        .toList();

                    if (statusTasks.isEmpty()) {
                        continue;
                    }

                    document.add(new Paragraph("Secao: " + translateStatus(status), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
                    document.add(new Paragraph(" "));

                    PdfPTable table = new PdfPTable(new float[]{3, 6, 2, 2});
                    table.setWidthPercentage(100f);
                    addHeaderCell(table, "Titulo");
                    addHeaderCell(table, "Descricao");
                    addHeaderCell(table, "Prioridade");
                    addHeaderCell(table, "Entrega");

                    for (TaskResponse task : statusTasks) {
                        table.addCell(safeText(task.title()));
                        table.addCell(safeText(task.description()));
                        table.addCell(translatePriority(task.priority()));
                        table.addCell(task.dueDate() != null ? DATE_FORMAT.format(task.dueDate()) : "-");
                    }

                    document.add(table);
                    document.add(new Paragraph(" "));
                }
            }

            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException | IOException ex) {
            throw new IllegalStateException("Nao foi possivel gerar o PDF", ex);
        }
    }

    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
        cell.setPadding(6);
        table.addCell(cell);
    }

    private String safeText(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }

    private String translateStatus(TaskStatus status) {
        return switch (status) {
            case TODO -> "A Fazer";
            case IN_PROGRESS -> "Fazendo";
            case DONE -> "Concluido";
        };
    }

    private String translatePriority(TaskPriority priority) {
        if (priority == null) {
            return "Padrao";
        }
        return switch (priority) {
            case LOW -> "Baixa";
            case MEDIUM -> "Media";
            case HIGH -> "Alta";
        };
    }
}
