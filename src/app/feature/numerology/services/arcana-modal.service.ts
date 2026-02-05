import {Injectable, inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ArcanaModalComponent} from '../components/arcana-modal/arcana-modal.component';
import type {
  ArcanaModalContext,
  ArcanaModalReadyData,
} from '../models/arcana-modal.model';
import {ArcanaTreeService} from './arcana-tree.service';

@Injectable({
  providedIn: 'root',
})
export class ArcanaModalService {
  private readonly dialog = inject(MatDialog);
  private readonly arcanaTreeService = inject(ArcanaTreeService);

  open(data: ArcanaModalReadyData): void {
    this.dialog.open(ArcanaModalComponent, {
      data,
      width: 'min(90vw, 560px)',
      minWidth: '280px',
      maxHeight: '90vh',
      ariaLabel: 'Arcana information',
      panelClass: 'arcana-dialog',
    });
  }

  /**
   * Opens the arcana modal with pre-computed description and karma status.
   * Resolves tree asynchronously; modal receives ready data.
   */
  openForPath(
    path: number[],
    negativeArcana: number[],
    context: ArcanaModalContext,
    contextMeta?: ArcanaModalReadyData['contextMeta']
  ): void {
    firstValueFrom(this.arcanaTreeService.tree$)
      .then(tree => {
        const description = tree
          ? this.arcanaTreeService.getDescriptionByPath(tree, path)
          : null;
        const hasNegativeKarma = this.arcanaTreeService.hasNegativeKarma(
          path,
          negativeArcana
        );
        this.open({
          arcana: path,
          description,
          hasNegativeKarma,
          context,
          contextMeta,
        });
      })
      .catch(() => {
        this.open({
          arcana: path,
          description: null,
          hasNegativeKarma: this.arcanaTreeService.hasNegativeKarma(
            path,
            negativeArcana
          ),
          context,
          contextMeta,
        });
      });
  }
}
