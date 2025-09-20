package com.example.kanban.service;

import com.example.kanban.dto.RegisterRequest;
import com.example.kanban.model.UserAccount;
import com.example.kanban.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserAccount register(RegisterRequest request) {
        if (userAccountRepository.existsByUsernameIgnoreCase(request.username())) {
            throw new IllegalArgumentException("Nome de usuario ja esta em uso");
        }
        if (userAccountRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email ja esta em uso");
        }

        UserAccount user = new UserAccount();
        user.setUsername(request.username().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.getRoles().add("ROLE_USER");
        return userAccountRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserAccount loadByUsername(String username) {
        return userAccountRepository.findByUsernameIgnoreCase(username)
            .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado"));
    }
}
