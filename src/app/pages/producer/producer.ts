import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

// Definindo a interface
export interface Producer {
  id: number;
  cpfOrCnpj: string;
  name: string;
  createdAt: string;
}

@Component({
  selector: 'app-producer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producer.html',
  styleUrls: ['./producer.scss']
})
export class Producer implements OnInit {
  producers: any[] = [];
  isLoading = true;
  errorMessage: string = '';
  selectedProducer: any = null;

  // Dados para novo produtor
  newProducer = {
    cpfOrCnpj: '',
    name: ''
  };
  editProducerData = {
    id: 0,
    cpfOrCnpj: '',
    name: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  // Método para visualizar detalhes do produtor
  onGet(producer: any, modalTemplate: any): void {
    this.apiService.get<any>(`producers/${producer.id}`).subscribe({
      next: (res) => {
        this.selectedProducer = res;
        this.cdRef.detectChanges();
        this.openModal(modalTemplate);
      },
      error: (err) => {
        console.error('Erro ao buscar dados do produtor:', err);
        alert('Erro ao carregar dados do produtor.');
      }
    });
  }

  // Método para criar novo produtor
  onCreate(): void {
    if (!this.newProducer.cpfOrCnpj || !this.newProducer.name) {
      alert('Preencha todos os campos!');
      return;
    }

    this.apiService.post<any>('producers/create', this.newProducer).subscribe({
      next: (res) => {
        alert('Produtor criado com sucesso!');
        this.newProducer = { cpfOrCnpj: '', name: '' };
        this.loadProducers();
      },
      error: (err) => {
        console.error('Erro ao criar produtor:', err);
        alert(err.error?.message || 'Erro ao criar produtor.');
      }
    });
  }

 onUpdate(): void {
  if (!this.editProducerData.cpfOrCnpj || !this.editProducerData.name) {
    alert('Preencha todos os campos!');
    return;
  }

  // Prepara o corpo da requisição sem o id
  const updatedData = {
    cpfOrCnpj: this.editProducerData.cpfOrCnpj,
    name: this.editProducerData.name
  };

  // Envia a requisição PUT
  this.apiService.put(`producers/update/${this.editProducerData.id}`, updatedData)
    .subscribe({
      next: () => {
        alert('Produtor atualizado com sucesso!');
        this.loadProducers();
      },
      error: (err) => {
        console.error('Erro ao atualizar:', err);
        alert(err.error?.message || 'Erro ao atualizar produtor');
      }
    });
}


  onDelete(producerId: number): void {
    if (!confirm('Tem certeza que deseja excluir este produtor?')) return;
    console.log('Enviando ID para exclusão:', producerId);
    this.apiService.delete(`producers/delete/${producerId}`).subscribe({
      next: () => {
        alert('Produtor excluído com sucesso!');
        this.loadProducers();
      },
      error: (err) => {
        console.error('Erro completo:', err);
        alert('Erro ao excluir produtor: ' + (err.error?.message || err.message));
      }
    });
  }

  // Método para abrir modal
  openModal(modalTemplate: any): void {
    this.modalService.open(modalTemplate, {
      ariaLabelledBy: 'producerModalLabel',
      size: 'lg'
    });
  }

  // Abre o modal de criação
  openCreateModal(modalTemplate: any): void {
    this.newProducer = { cpfOrCnpj: '', name: '' }; // Reseta o formulário
    this.modalService.open(modalTemplate);
  }

  openEditModal(producer: any, modalTemplate: any): void {
    this.editProducerData = {
      id: producer.id,
      cpfOrCnpj: producer.cpfOrCnpj,
      name: producer.name
    };
    this.modalService.open(modalTemplate);
  }

  // Handler para o submit do formulário
  onSubmit(modal: any): void {
    this.onCreate(); // Chama seu método existente
    modal.close(); // Fecha o modal após o submit
  }

  // Método para carregar lista de produtores
  private loadProducers(): void {
    this.isLoading = true;
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      this.router.navigateByUrl('signin');
      return;
    }

    this.apiService.get<any>('producers/list').subscribe({
      next: (res) => {
        this.producers = res.producers.map((p: Producer) => ({
          id: p.id,
          cpfOrCnpj: p.cpfOrCnpj,
          name: p.name,
          createdAt: new Date(p.createdAt).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigateByUrl('signin');
          localStorage.removeItem('accessToken');
        } else {
          alert('Erro ao consultar os dados dos produtores.');
        }
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Inicialização do componente
  ngOnInit(): void {
    this.loadProducers();
  }
}
