import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

export interface Producer {
  id: number;
  cpfOrCnpj: string;
  name: string;
  createdAt: string;
}

interface Farm {
  id: number;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  createdAt: string;
  updatedAt: string;
  crops: FarmCrop[];  // Aqui, associamos a fazenda a várias culturas.
}

interface FarmCrop {
  id: number;
  name: string;
  variety: string;
  harvestYear: number;
  plantingDate: string;
  harvestDate: string;
  area: number;
  yield: number;
  farmId: number;
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
  newProducer = { cpfOrCnpj: '', name: '' };
  editProducerData = { id: 0, cpfOrCnpj: '', name: '' };
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 1;
  searchTerm: string = '';


  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
  ) { }




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

    const updatedData = {
      cpfOrCnpj: this.editProducerData.cpfOrCnpj,
      name: this.editProducerData.name
    };

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

  openModal(modalTemplate: any): void {
    this.modalService.open(modalTemplate, {
      ariaLabelledBy: 'producerModalLabel',
      size: 'lg'
    });
  }

  openCreateModal(modalTemplate: any): void {
    this.newProducer = { cpfOrCnpj: '', name: '' };
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

  onSubmit(modal: any): void {
    this.onCreate();
    modal.close();
  }

  private loadProducers(page: number = 1, searchTerm: string = ''): void {
    this.isLoading = true;
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      this.router.navigateByUrl('signin');
      return;
    }

    this.apiService.get<any>(`producers/list?page=${page}&limit=12`).subscribe({
      next: (res) => {
        if (searchTerm.trim()) {
          this.producers = res.producers.filter((producer: Producer) =>
            producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producer.cpfOrCnpj.includes(searchTerm)
          );
        } else {
          this.producers = res.producers;
        }

        this.totalItems = res.total;
        this.totalPages = res.lastPage;
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

  selectedFarmCrops: any[] = [];  // Armazenar as culturas da fazenda selecionada
  selectedFarmName: string = '';  // Nome da fazenda para exibir no modal

  @ViewChild('cropModal', { static: false }) cropModal: any; // Referência ao template do modal de culturas


  openCropModal(farm: any) {
    console.log("Objeto enviado para o modal:", farm);
    this.selectedFarmName = farm.name;

    // Chama o ApiService para buscar as culturas da fazenda
    this.apiService.get<any[]>(`crops/by-farm/${farm.id}`).subscribe(
      (crops) => {
        console.log("Culturas da fazenda:", crops);  // Verifique as culturas recebidas
        if (crops && Array.isArray(crops)) {
          this.selectedFarmCrops = crops;  // Armazene as culturas
        } else {
          this.selectedFarmCrops = [];  // Se não houver culturas, coloque um array vazio
        }
        this.cdRef.detectChanges();  // Forçar detecção de mudanças
        this.modalService.open(this.cropModal);  // Abra o modal
      },
      (error) => {
        console.error("Erro ao buscar culturas:", error);
        this.selectedFarmCrops = [];  // Se ocorrer erro, defina um array vazio
        this.cdRef.detectChanges();
        this.modalService.open(this.cropModal);  // Abra o modal de qualquer forma
      }
    );
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducers(this.currentPage, this.searchTerm);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducers(this.currentPage, this.searchTerm);
    }
  }

  onSearch(): void {
    this.loadProducers(this.currentPage, this.searchTerm);
  }

  ngOnInit(): void {
    this.loadProducers();
    this.cdRef.detectChanges();
  }
}
