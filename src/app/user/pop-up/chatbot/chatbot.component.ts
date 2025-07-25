import { Component, OnInit } from '@angular/core';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  userMessage = '';
  messages: ChatMessage[] = [];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    this.messages = this.chatbotService.getMessages();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.chatbotService.addBotMessage('Tôi là Eventa Chatbot, xin chào quý khách! 👋');
      this.messages = this.chatbotService.getMessages();
    }
  }

  sendMessage() {
    const message = this.userMessage.trim();
    if (!message) return;

    this.chatbotService.addUserMessage(message);
    this.userMessage = '';
    this.messages = this.chatbotService.getMessages();

    this.chatbotService.chat(message).subscribe(() => {
      this.messages = this.chatbotService.getMessages();
    });
  }
}
