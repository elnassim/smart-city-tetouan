package com.example.clerk_webhook_service.clients;
import com.example.clerk_webhook_service.dtos.SessionDTO;
import com.example.clerk_webhook_service.dtos.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-data-service", url = "${user.service.url:http://localhost:8081}") 
public interface UserClient {
    @PostMapping("/api/users")
    void syncUser(@RequestBody UserDTO user);

    @DeleteMapping("/api/users/{clerkId}")
    void deleteUser(@PathVariable("clerkId") String clerkId);

    @PostMapping("/api/users/sessions")
    void syncSession(@RequestBody SessionDTO session);
}
