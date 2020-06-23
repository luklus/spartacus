import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { Product } from '@spartacus/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { ICON_TYPE } from '../../misc/icon/index';
import { CurrentProductService } from '../current-product.service';
import { ProductImagesComponentService } from './product-images-component.service';

@Component({
  selector: 'cx-product-images',
  templateUrl: './product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImagesComponent implements OnDestroy {
  iconTypes = ICON_TYPE;
  private subscription = new Subscription();
  private mainMediaContainer = new BehaviorSubject(null);

  private product$: Observable<
    Product
  > = this.currentProductService.getProduct().pipe(
    filter(Boolean),
    distinctUntilChanged(),
    tap((p: Product) => {
      this.mainMediaContainer.next(p.images?.PRIMARY ? p.images.PRIMARY : {});
    })
  );

  thumbs$: Observable<any[]> = this.product$.pipe(
    map((p: Product) => this.createThumbs(p))
  );

  mainImage$ = combineLatest([this.product$, this.mainMediaContainer]).pipe(
    map(([, container]) => container)
  );

  constructor(
    private currentProductService: CurrentProductService,
    protected productImagesComponentService: ProductImagesComponentService,
    protected vcr: ViewContainerRef
  ) {}

  openImage(item: any): void {
    this.mainMediaContainer.next(item);
  }

  isActive(thumbnail): Observable<boolean> {
    return this.mainMediaContainer.pipe(
      filter(Boolean),
      map((container: any) => {
        return (
          container.zoom &&
          container.zoom.url &&
          thumbnail.zoom &&
          thumbnail.zoom.url &&
          container.zoom.url === thumbnail.zoom.url
        );
      })
    );
  }

  /** find the index of the main media in the list of media */
  getActive(thumbs: any[]): Observable<number> {
    return this.mainMediaContainer.pipe(
      filter(Boolean),
      map((container: any) => {
        const current = thumbs.find(
          (t) =>
            t.media &&
            container.zoom &&
            t.media.container &&
            t.media.container.zoom &&
            t.media.container.zoom.url === container.zoom.url
        );
        return thumbs.indexOf(current);
      })
    );
  }

  triggerZoom(): void {
    const component = this.productImagesComponentService.expandImage(
      this.vcr,
      this.mainMediaContainer.value?.zoom?.galleryIndex
    );

    if (component) {
      this.subscription.add(component.subscribe());
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Return an array of CarouselItems for the product thumbnails.
   * In case there are less then 2 thumbs, we return null.
   */
  private createThumbs(product: Product): Observable<any>[] {
    if (
      !product.images ||
      !product.images.GALLERY ||
      product.images.GALLERY.length < 2
    ) {
      return [];
    }

    return (<any[]>product.images.GALLERY).map((c) => of({ container: c }));
  }
}
